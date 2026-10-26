const DEFAULT_PINTEREST_PROFILE_URL = 'https://www.pinterest.com/cozivaraliving2495/_profile/';

export function getPinterestProfileUrl(configuredUrl?: string): string | undefined {
  const profileUrl = configuredUrl?.trim() || DEFAULT_PINTEREST_PROFILE_URL;

  try {
    const candidate = new URL(profileUrl);
    const pathParts = candidate.pathname.split('/').filter(Boolean);
    const isProfilePath =
      pathParts.length === 1 ||
      (pathParts.length === 2 && pathParts[1] === '_profile');

    if (
      candidate.protocol === 'https:' &&
      ['pinterest.com', 'www.pinterest.com'].includes(candidate.hostname) &&
      /^[a-z0-9_-]+$/i.test(pathParts[0] || '') &&
      isProfilePath &&
      !candidate.search &&
      !candidate.hash
    ) {
      return candidate.href;
    }
  } catch {
    // Keep malformed configuration from producing a broken external link.
  }

  return undefined;
}
