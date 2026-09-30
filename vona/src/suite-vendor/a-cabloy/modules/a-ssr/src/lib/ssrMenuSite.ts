export function validateSsrMenuSite(
  site: unknown,
  name: string,
): asserts site is string | string[] {
  const isSiteName = (value: unknown) => typeof value === 'string' && !!value.trim();
  if (Array.isArray(site) ? [...site].every(isSiteName) : isSiteName(site)) return;
  throw new TypeError(
    `Should explicitly specify site for ${name}: use an SSR site name or an array of non-empty site names ([] means no sites)`,
  );
}
