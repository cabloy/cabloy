export const TEST_REQUIRE_FRESH_RESOURCES_ENV = 'VONA_TEST_REQUIRE_FRESH_RESOURCES';

export function requiresFreshTestResources(env: NodeJS.ProcessEnv = process.env) {
  const value = env[TEST_REQUIRE_FRESH_RESOURCES_ENV];
  if (value !== undefined && value !== 'true') {
    throw new Error('Invalid strict test resource freshness flag');
  }
  return value === 'true';
}
