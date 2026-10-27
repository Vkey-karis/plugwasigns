import type { PortfolioItem } from '../data/portfolio';

interface SyncOptions {
  token: string;
  repo: string; // e.g. "Vkey-karis/plugwasigns"
  branch: string; // e.g. "main"
  items: PortfolioItem[];
  newImages: Array<{ filename: string; base64Content: string }>;
  commitMessage?: string;
}

interface GitHubFileResponse {
  sha?: string;
  message?: string;
  content?: string;
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function getFileSha(repo: string, path: string, branch: string, token: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (res.status === 200) {
    const data: GitHubFileResponse = await res.json();
    return data.sha || null;
  }
  return null;
}

async function putFileContent(
  repo: string,
  path: string,
  branch: string,
  token: string,
  contentBase64: string,
  message: string,
  sha: string | null
): Promise<{ ok: boolean; error?: string }> {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  const body: Record<string, any> = {
    message,
    content: contentBase64,
    branch
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return {
      ok: false,
      error: errData.message || `HTTP ${res.status}: Failed to commit ${path}`
    };
  }

  return { ok: true };
}

export async function syncPortfolioToGitHub({
  token,
  repo,
  branch = 'main',
  items,
  newImages = [],
  commitMessage = 'admin: update portfolio content'
}: SyncOptions): Promise<{ success: boolean; message: string; commitUrl?: string }> {
  try {
    // 1. Upload any new images first
    for (const img of newImages) {
      // Clean base64 prefix if present (e.g. data:image/jpeg;base64,...)
      const cleanBase64 = img.base64Content.replace(/^data:image\/[a-z]+;base64,/, '');

      // Check paths: plugwasigns/public/work/ or public/work/
      const primaryPath = `plugwasigns/public/work/${img.filename}`;
      const fallbackPath = `public/work/${img.filename}`;

      // Check if primary path exists (to get sha if replacing)
      let sha = await getFileSha(repo, primaryPath, branch, token);
      let targetPath = primaryPath;

      if (!sha) {
        const fallbackSha = await getFileSha(repo, fallbackPath, branch, token);
        if (fallbackSha) {
          sha = fallbackSha;
          targetPath = fallbackPath;
        }
      }

      const imgRes = await putFileContent(
        repo,
        targetPath,
        branch,
        token,
        cleanBase64,
        `admin: upload media ${img.filename}`,
        sha
      );

      if (!imgRes.ok) {
        throw new Error(`Failed to upload ${img.filename}: ${imgRes.error}`);
      }
    }

    // 2. Commit updated portfolio.json
    const jsonString = JSON.stringify(items, null, 2);
    const jsonBase64 = utf8ToBase64(jsonString);

    const primaryJsonPath = 'plugwasigns/src/data/portfolio.json';
    const fallbackJsonPath = 'src/data/portfolio.json';

    let jsonSha = await getFileSha(repo, primaryJsonPath, branch, token);
    let targetJsonPath = primaryJsonPath;

    if (!jsonSha) {
      const fallbackSha = await getFileSha(repo, fallbackJsonPath, branch, token);
      if (fallbackSha) {
        jsonSha = fallbackSha;
        targetJsonPath = fallbackJsonPath;
      }
    }

    const jsonRes = await putFileContent(
      repo,
      targetJsonPath,
      branch,
      token,
      jsonBase64,
      commitMessage,
      jsonSha
    );

    if (!jsonRes.ok) {
      throw new Error(`Failed to save portfolio.json: ${jsonRes.error}`);
    }

    const commitUrl = `https://github.com/${repo}/commits/${branch}`;

    return {
      success: true,
      message: 'Successfully committed changes to GitHub! Netlify build will trigger automatically.',
      commitUrl
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to sync with GitHub API.'
    };
  }
}
