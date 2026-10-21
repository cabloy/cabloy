import type { OxlintConfig } from 'oxlint';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.resolve('@cabloy/lint'));

// Nested configs must share plugin files to avoid duplicate plugin names in Oxlint.
export function resolveOxlintPlugins(config: OxlintConfig): OxlintConfig {
  return {
    ...config,
    jsPlugins: resolvePlugins(config.jsPlugins),
    overrides: config.overrides?.map(override => ({
      ...override,
      jsPlugins: resolvePlugins(override.jsPlugins),
    })),
  };
}

function resolvePlugins(plugins: OxlintConfig['jsPlugins']): OxlintConfig['jsPlugins'] {
  return plugins?.map(plugin =>
    typeof plugin === 'string'
      ? require.resolve(plugin)
      : { ...plugin, specifier: require.resolve(plugin.specifier) },
  );
}
