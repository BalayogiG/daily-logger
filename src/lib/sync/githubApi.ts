export interface GitHubClientConfig {
  owner: string
  repo: string
  path: string
  token: string
}

export interface GitHubFile {
  contentBase64: string
  sha: string
}

export class GitHubApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GitHubApiError'
    this.status = status
  }
}

function contentsUrl({ owner, repo, path }: GitHubClientConfig) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/')
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function safeText(res: Response) {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

/** Fetches the data file. Returns `null` if it doesn't exist yet (first-ever sync). */
export async function getFile(config: GitHubClientConfig): Promise<GitHubFile | null> {
  const res = await fetch(contentsUrl(config), { headers: authHeaders(config.token) })
  if (res.status === 404) return null
  if (!res.ok) throw new GitHubApiError(`GitHub GET failed: ${res.status} ${await safeText(res)}`, res.status)
  const json = (await res.json()) as { content: string; sha: string }
  return { contentBase64: json.content.replace(/\n/g, ''), sha: json.sha }
}

/**
 * Creates/updates the data file. Pass the `sha` from the last `getFile()` call, or `undefined`
 * for a brand-new file. GitHub rejects the write with 409 if the file changed since that `sha`
 * was read — the sync engine relies on this as its concurrency guard for two-device races.
 */
export async function putFile(
  config: GitHubClientConfig,
  contentBase64: string,
  sha: string | undefined,
  message: string,
): Promise<{ sha: string }> {
  const res = await fetch(contentsUrl(config), {
    method: 'PUT',
    headers: { ...authHeaders(config.token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: contentBase64, sha }),
  })
  if (!res.ok) throw new GitHubApiError(`GitHub PUT failed: ${res.status} ${await safeText(res)}`, res.status)
  const json = (await res.json()) as { content: { sha: string } }
  return { sha: json.content.sha }
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}
