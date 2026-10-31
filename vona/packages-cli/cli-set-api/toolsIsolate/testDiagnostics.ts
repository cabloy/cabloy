export function formatActiveResourceCounts(types: readonly string[]): string {
  const counts = new Map<string, number>();
  for (const type of types) counts.set(type, (counts.get(type) ?? 0) + 1);
  return JSON.stringify(
    Object.fromEntries([...counts].toSorted(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))),
  );
}
