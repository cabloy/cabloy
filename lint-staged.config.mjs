// Must stay in sync with oxfmt.config.ts ignorePatterns
const OXFMT_IGNORE_PATTERNS = [
  // root original
  '**/.claude',
  '**/.vscode',
  // file type patterns
  '*.min.js',
  '*.code-snippets',
  // glob patterns
  '**/dist/**',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/bun.lockb',
  '**/static/**',
  '**/.rollup.cache/**',
  '**/.metadata/index.ts',
  '**/.vitepress/cache',
  '**/vite.config.ts.timestamp-*',
  '**/quasar.config.ts.temporary.*',
  // common directory patterns
  '**/.vona',
  '**/.assets',
  '**/.app',
  '**/.zova-rest',
  '**/.zova',
  '**/.nx',
  '**/.quasar',
  '**/coverage',
  '**/docker-compose',
  '**/assets',
  '**/dist-releases',
  '**/dist-mock',
  '**/src-capacitor',
  '**/src-cordova',
  // vona-specific
  '**/zovaRest',
  'vona/packages-cli/cli-set-api/cli/templates',
  // zova-specific
  'zova/packages-cli/cli-set-front/cli/templates',
];

function isOxfmtIgnored(filepath) {
  const parts = filepath.split('/');
  const basename = parts.at(-1);
  return OXFMT_IGNORE_PATTERNS.some(pattern => {
    // basename-only patterns (e.g. *.min.js)
    if (!pattern.includes('/')) {
      if (matchGlob(basename, pattern)) return true;
    }
    // **/prefix patterns
    if (pattern.startsWith('**/')) {
      const suffix = pattern.slice(3);
      for (let i = 0; i < parts.length; i++) {
        if (matchGlob(parts[i], suffix)) return true;
      }
    }
    // **/dir/** patterns
    if (pattern.startsWith('**/') && pattern.endsWith('/**')) {
      const dir = pattern.slice(3, -3);
      if (parts.includes(dir)) return true;
    }
    // prefix/path patterns (no **)
    if (!pattern.startsWith('**') && filepath.includes(pattern)) return true;
    return false;
  });
}

function matchGlob(name, pattern) {
  const re = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]');
  return new RegExp(`^${re}$`).test(name);
}

function filterIgnored(filenames) {
  return filenames.filter(f => !isOxfmtIgnored(f));
}

export default {
  '*.{js,jsx,ts,tsx,vue,mjs,cjs}': filenames => {
    const filtered = filterIgnored(filenames);
    if (filtered.length === 0) return [];
    return ['npm run lint:fix', `npm run format:fix -- ${filtered.join(' ')}`];
  },
  '*.{json,yaml,yml,md,css,scss,html}': filenames => {
    const filtered = filterIgnored(filenames);
    if (filtered.length === 0) return [];
    return [`npm run format:fix -- ${filtered.join(' ')}`];
  },
};
