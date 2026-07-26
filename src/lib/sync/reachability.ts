/**
 * Unlike a self-hosted server on a private network, GitHub's API is a public managed service —
 * so `navigator.onLine` (general internet connectivity) is actually a meaningful pre-check here,
 * unlike it would be for a Tailscale-only backend.
 */
export async function isGitHubReachable(): Promise<boolean> {
  if (!navigator.onLine) return false
  try {
    const res = await fetch('https://api.github.com/', { method: 'GET', cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}
