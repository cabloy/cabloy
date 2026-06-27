import { basename, isAbsolute, matchesGlob, relative, sep } from 'node:path';

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

function normalizeFilepath(filepath) {
  const normalized = isAbsolute(filepath) ? relative(process.cwd(), filepath) : filepath;
  return normalized.split(sep).join('/');
}

function matchesPathPattern(filepath, pattern) {
  if (matchesGlob(filepath, pattern)) return true;
  if (pattern.startsWith('**/')) {
    const suffix = pattern.slice(3);
    if (!/[*?]/.test(suffix)) {
      return (
        filepath === suffix || filepath.endsWith(`/${suffix}`) || filepath.includes(`/${suffix}/`)
      );
    }
  }
  if (!/[*?]/.test(pattern)) {
    return filepath === pattern || filepath.startsWith(`${pattern}/`);
  }
  return false;
}

function isOxfmtIgnored(filepath) {
  const normalized = normalizeFilepath(filepath);
  const filename = basename(normalized);
  return OXFMT_IGNORE_PATTERNS.some(pattern => {
    if (!pattern.includes('/')) {
      return matchesGlob(filename, pattern);
    }
    return matchesPathPattern(normalized, pattern);
  });
}

function filterIgnored(filenames) {
  return filenames.filter(filename => !isOxfmtIgnored(filename));
}

function joinShellArgs(filenames) {
  return filenames.map(filename => JSON.stringify(filename)).join(' ');
}

function createOxfmtCommand(filenames) {
  return `node scripts/run-oxfmt-safe.mjs ${joinShellArgs(filenames)}`;
}

export default {
  '*.{js,jsx,ts,tsx,vue,mjs,cjs}': filenames => {
    const filtered = filterIgnored(filenames);
    if (filtered.length === 0) return [];
    return ['npm run lint:fix', createOxfmtCommand(filtered)];
  },
  '*.{json,yaml,yml,md,css,scss,html}': filenames => {
    const filtered = filterIgnored(filenames);
    if (filtered.length === 0) return [];
    return [createOxfmtCommand(filtered)];
  },
};
