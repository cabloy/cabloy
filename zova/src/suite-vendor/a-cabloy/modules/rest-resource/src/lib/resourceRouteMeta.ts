export const resourceRouteMeta = {
  tabKey: resourceTabKey,
  componentKey: resourceTabKey,
  ssrProfile: 'session' as const,
};

export function resourceTabKey(route: { params: Record<string, string | string[]> }) {
  return `/rest/resource/${encodeURIComponent(route.params.resource as string)}`;
}
