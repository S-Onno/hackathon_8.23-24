const FALLBACK_PATH = "/top";
const INTERNAL_ORIGIN = "https://universe.invalid";

export function safeRedirectPath(
  requestedPath: string | null | undefined,
  fallback = FALLBACK_PATH,
): string {
  if (
    !requestedPath?.startsWith("/") ||
    requestedPath.startsWith("//") ||
    requestedPath.includes("\\") ||
    /[\u0000-\u001F\u007F]/u.test(requestedPath)
  ) {
    return fallback;
  }

  try {
    const destination = new URL(requestedPath, INTERNAL_ORIGIN);
    if (destination.origin !== INTERNAL_ORIGIN) {
      return fallback;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return fallback;
  }
}
