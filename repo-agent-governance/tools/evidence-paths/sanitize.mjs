import { constants, realpathSync } from 'node:fs';
import { lstat, open, readdir } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { basename, join, parse, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_REPO_ROOT = resolve(fileURLToPath(import.meta.url), '../../../..');
export const LINE_LIMIT = 1024 * 1024;
export const FILE_LIMIT = 8 * 1024 * 1024;

class SafeError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

function fail(code) {
  throw new SafeError(code);
}

function rootInfo(value) {
  if (
    typeof value !== 'string' ||
    Array.from(value).some(char => char.codePointAt(0) < 32 || char.codePointAt(0) === 127)
  ) {
    fail('INVALID_ROOT');
  }
  const windows = /^[A-Za-z]:[/\\]/u.test(value) || /^\\\\[^\\]+\\[^\\]+/u.test(value);
  if (!windows && !value.startsWith('/')) fail('INVALID_ROOT');
  let root = windows ? value.replaceAll('\\', '/') : value;
  root = root.replace(/\/+$/u, '');
  // Volume roots would turn a bounded recognizer into a universal slash matcher.
  if (
    !root ||
    /^[A-Za-z]:$/u.test(root) ||
    root.split('/').some(part => part === '.' || part === '..')
  ) {
    fail('INVALID_ROOT');
  }
  return { root, windows, key: windows ? root.toLowerCase() : root };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function rootPattern(info) {
  const pieces = info.root.split('/').map(escapeRegex);
  // A separator may be native, forward-slash, or a JSON-escaped backslash.
  return pieces.join(info.windows ? '(?:\\\\{1,2}|/)' : '/');
}

function nativeRoots() {
  const roots = [];
  for (const value of [homedir(), tmpdir()]) {
    if (!value) continue;
    roots.push(value);
    try {
      roots.push(realpathSync(value));
    } catch {
      // Lexical coverage remains available when a native root does not exist.
    }
  }
  return roots;
}

function pathEnd(text, start, quoted) {
  let end = start;
  while (end < text.length) {
    const char = text[end];
    if (/[\p{Cc}"'`<>(){}[\]|,;!?]/u.test(char) || (!quoted && /\s/u.test(char))) break;
    // Preserve stack line/column suffixes (and keep other colon-delimited prose out).
    if (char === ':') break;
    end++;
  }
  // Sentence punctuation is not part of an unquoted path token.
  if (!quoted) {
    while (end > start && text[end - 1] === '.') end--;
  }
  return end;
}

function boundary(text, index) {
  return index === 0 || !/[\p{L}\p{N}_./\\%~@+\->]/u.test(text[index - 1]);
}

function normalizeTail(value, windows) {
  return windows ? value.replace(/\\{1,2}/gu, '/') : value;
}

/** Shared, bounded recognition. No universal absolute-path detection is attempted. */
export function createMatcher({ repoRoot = DEFAULT_REPO_ROOT, maps = [] } = {}) {
  const explicit = [];
  const seen = new Map();
  function add(value, alias, privateRoot = false) {
    const info = rootInfo(value);
    const prior = seen.get(info.key);
    if (prior) {
      if (!privateRoot && prior.alias !== alias) fail('CONFLICTING_ROOT');
      return;
    }
    const entry = { ...info, alias, privateRoot };
    entry.regex = new RegExp(rootPattern(info), info.windows ? 'iy' : 'y');
    explicit.push(entry);
    seen.set(info.key, entry);
  }
  add(repoRoot, null);
  if (!Array.isArray(maps)) fail('INVALID_MAP');
  for (const map of maps) {
    if (!map || typeof map.alias !== 'string') fail('INVALID_MAP');
    const alias = map.alias.replace(/^<([A-Z][A-Z0-9_]*)>$/u, '$1');
    if (!/^[A-Z][A-Z0-9_]*$/u.test(alias)) fail('INVALID_ALIAS');
    add(map.root, alias);
  }
  for (const root of nativeRoots()) add(root, 'PRIVATE_PATH', true);
  explicit.sort(
    (a, b) => b.root.length - a.root.length || Number(a.privateRoot) - Number(b.privateRoot),
  );

  const sep = '(?:\\\\{1,2}|/)';
  const account =
    '[^/\\\\\\s\\p{Cc}"\'`<>(){}[\\]|,;:!?]+(?: [^/\\\\\\s\\p{Cc}"\'`<>(){}[\\]|,;:!?]+)*';
  const known = [
    new RegExp(`/(?:Users|home)/${account}`, 'uy'),
    /\/(?:private\/)?tmp/y,
    /\/(?:private\/)?var\/folders/y,
    new RegExp(`[A-Z]:${sep}(?:Users${sep}${account}|(?:Windows${sep})?Temp)`, 'iuy'),
    // UNC is a filesystem convention; forward-slash protocol-relative URLs are not.
    /\\{2,4}[^\\/\s\p{Cc}"'`<>(){}[\]|,;:!?]+\\{1,2}[^\\/\s\p{Cc}"'`<>(){}[\]|,;:!?]+/uy,
  ];

  function recognizeAt(text, start, quoted = false) {
    for (const entry of explicit) {
      entry.regex.lastIndex = start;
      const match = entry.regex.exec(text);
      if (!match) continue;
      const after = start + match[0].length;
      if (after < text.length && !/[/\\\s\p{Cc}"'`<>(){}[\]|,;:!?]/u.test(text[after])) continue;
      const end = pathEnd(text, after, quoted);
      const tail = normalizeTail(text.slice(after, end), entry.windows).replace(/^\/+|\/+$/gu, '');
      const replacement =
        entry.privateRoot || tail.split('/').some(part => part === '.' || part === '..')
          ? '<PRIVATE_PATH>'
          : entry.alias
            ? `<${entry.alias}>${tail ? `/${sanitize(tail)}` : ''}`
            : tail
              ? sanitize(tail)
              : '.';
      return { end, replacement };
    }
    for (const regex of known) {
      regex.lastIndex = start;
      const match = regex.exec(text);
      if (!match) continue;
      const after = start + match[0].length;
      if (after < text.length && !/[/\\\s\p{Cc}"'`<>(){}[\]|,;:!?]/u.test(text[after])) continue;
      return { end: pathEnd(text, after, quoted), replacement: '<PRIVATE_PATH>' };
    }
    return null;
  }

  function find(text) {
    if (typeof text !== 'string') fail('INVALID_TEXT');
    const matches = [];
    // Skip non-file URLs as units, including their paths, query strings and fragments.
    const urls = /[A-Za-z][A-Za-z0-9+.-]{0,31}:\/\/[^\s\p{Cc}"'`<>(){}[\]|]+/gu;
    const protectedUrls = [...text.matchAll(urls)];
    let urlIndex = 0;
    for (let index = 0; index < text.length; index++) {
      const url = protectedUrls[urlIndex];
      if (url && index === url.index) {
        urlIndex++;
        if (/^file:\/\//iu.test(url[0]) && boundary(text, index)) {
          try {
            const parsed = new URL(url[0]);
            let local = decodeURIComponent(parsed.pathname);
            if (parsed.hostname && parsed.hostname !== 'localhost') {
              local = `\\\\${parsed.hostname}${local.replaceAll('/', '\\')}`;
            } else if (/^\/[A-Za-z]:\//u.test(local)) {
              local = local.slice(1);
            }
            const found = recognizeAt(local, 0, true);
            matches.push({
              start: index,
              end: index + url[0].length,
              replacement: found ? found.replacement + local.slice(found.end) : '<PRIVATE_PATH>',
            });
          } catch {
            // Malformed file URLs are not safe to partially decode or echo.
            matches.push({
              start: index,
              end: index + url[0].length,
              replacement: '<PRIVATE_PATH>',
            });
          }
        }
        index += url[0].length - 1;
        continue;
      }
      if (!boundary(text, index)) continue;
      const quoted = index > 0 && /["'`]/u.test(text[index - 1]);
      const found = recognizeAt(text, index, quoted);
      if (found) {
        matches.push({ start: index, ...found });
        index = found.end - 1;
      }
    }
    return matches;
  }

  function sanitize(text) {
    let result = '';
    let offset = 0;
    for (const match of find(text)) {
      result += text.slice(offset, match.start) + match.replacement;
      offset = match.end;
    }
    return result + text.slice(offset);
  }
  return Object.freeze({ find, sanitize });
}

function decode(bytes) {
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    fail('INVALID_UTF8');
  }
}

async function write(output, text) {
  try {
    await new Promise((resolveWrite, reject) => {
      output.write(text, error => (error ? reject(error) : resolveWrite()));
    });
  } catch {
    fail('OUTPUT_ERROR');
  }
}

/** Emits only fully validated, sanitized lines; preceding successful lines may remain on failure. */
export async function sanitizeStream(input, output, { matcher = createMatcher() } = {}) {
  let outputFailed = false;
  const onError = () => {
    outputFailed = true;
  };
  output.on('error', onError);
  let parts = [];
  let length = 0;
  try {
    for await (const chunk of input) {
      if (outputFailed) fail('OUTPUT_ERROR');
      // Buffer input is required so upstream decoding cannot hide invalid UTF-8.
      if (!(chunk instanceof Uint8Array)) fail('INVALID_INPUT');
      const bytes = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      let start = 0;
      while (start < bytes.length) {
        const newline = bytes.indexOf(10, start);
        const end = newline < 0 ? bytes.length : newline;
        length += end - start;
        if (length > LINE_LIMIT) fail('LINE_LIMIT');
        parts.push(bytes.subarray(start, end));
        if (newline < 0) break;
        const line = Buffer.concat(parts, length);
        const text = decode(line);
        await write(output, `${matcher.sanitize(text)}\n`);
        parts = [];
        length = 0;
        start = newline + 1;
      }
    }
    if (length) {
      const line = Buffer.concat(parts, length);
      await write(output, matcher.sanitize(decode(line)));
    }
    if (outputFailed) fail('OUTPUT_ERROR');
  } catch (error) {
    if (error instanceof SafeError) throw error;
    fail('INPUT_ERROR');
  } finally {
    output.off('error', onError);
  }
}

function safeFilename(value, matcher) {
  return matcher
    .sanitize(value)
    .replace(
      /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}:\\]/gu,
      char => `\\u${char.codePointAt(0).toString(16).padStart(4, '0')}`,
    );
}

function binary(bytes) {
  return bytes.some(
    byte => byte === 0 || byte === 127 || (byte < 32 && ![9, 10, 12, 13].includes(byte)),
  );
}

async function ancestorExclusion(path) {
  const root = parse(path).root;
  let current = root;
  // resolve() normalizes native separators; POSIX backslashes remain literal filename characters.
  for (const part of path.slice(root.length).split(sep)) {
    if (!part) continue;
    if (part.startsWith('.env')) return 'ENV_EXCLUDED';
    current = join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) return 'SYMLINK_EXCLUDED';
    } catch {
      return 'UNREADABLE';
    }
  }
  return null;
}

/** Read-only, explicit scopes. Incomplete takes precedence over findings. */
export async function checkPaths(scopes, { matcher = createMatcher() } = {}) {
  if (
    !Array.isArray(scopes) ||
    !scopes.length ||
    scopes.some(scope => typeof scope !== 'string' || !scope)
  ) {
    fail('INVALID_SCOPE');
  }
  const diagnostics = [];
  let incomplete = false;
  let findings = false;
  function report(label, line, code) {
    diagnostics.push(`${label}:${line} ${code}`);
    if (code === 'PATH_FOUND') findings = true;
    else incomplete = true;
  }
  async function scan(path, label) {
    if (basename(path).startsWith('.env')) {
      report(label, 0, 'ENV_EXCLUDED');
      return;
    }
    let stat;
    try {
      stat = await lstat(path);
    } catch {
      report(label, 0, 'UNREADABLE');
      return;
    }
    if (stat.isSymbolicLink()) {
      report(label, 0, 'SYMLINK_EXCLUDED');
      return;
    }
    if (stat.isDirectory()) {
      let entries;
      try {
        entries = await readdir(path);
      } catch {
        report(label, 0, 'UNREADABLE');
        return;
      }
      entries.sort();
      for (const entry of entries)
        await scan(join(path, entry), `${label}/${safeFilename(entry, matcher)}`);
      return;
    }
    if (!stat.isFile()) {
      report(label, 0, 'SPECIAL_EXCLUDED');
      return;
    }
    if (stat.size > FILE_LIMIT) {
      report(label, 0, 'SIZE_LIMIT');
      return;
    }
    // POSIX mode-000 files remain unreadable even for privileged runners; Windows relies on open/ACL errors.
    if (process.platform !== 'win32' && (stat.mode & 0o444) === 0) {
      report(label, 0, 'UNREADABLE');
      return;
    }
    let handle;
    let bytes;
    try {
      handle = await open(
        path,
        constants.O_RDONLY | (constants.O_NOFOLLOW || 0) | (constants.O_NONBLOCK || 0),
      );
      const opened = await handle.stat();
      if (!opened.isFile() || opened.ino !== stat.ino || opened.dev !== stat.dev)
        fail('UNREADABLE');
      const chunks = [];
      let size = 0;
      while (true) {
        const buffer = Buffer.alloc(64 * 1024);
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
        if (!bytesRead) break;
        size += bytesRead;
        if (size > FILE_LIMIT) fail('SIZE_LIMIT');
        chunks.push(buffer.subarray(0, bytesRead));
      }
      bytes = Buffer.concat(chunks, size);
    } catch (error) {
      report(label, 0, error instanceof SafeError ? error.code : 'UNREADABLE');
      return;
    } finally {
      if (handle) await handle.close().catch(() => {});
    }
    if (binary(bytes)) {
      report(label, 0, 'BINARY');
      return;
    }
    let text;
    try {
      text = decode(bytes);
    } catch {
      report(label, 0, 'INVALID_UTF8');
      return;
    }
    const lines = text.split('\n');
    if (lines.some(line => Buffer.byteLength(line) > LINE_LIMIT)) {
      report(label, 0, 'LINE_LIMIT');
      return;
    }
    for (let index = 0; index < lines.length; index++) {
      if (matcher.find(lines[index]).length) report(label, index + 1, 'PATH_FOUND');
    }
  }
  // Input order defines stable scope IDs; each directory is visited in lexical order.
  for (const [index, scope] of scopes.entries()) {
    const path = resolve(scope);
    const label = `scope-${index + 1}`;
    const exclusion = await ancestorExclusion(path);
    if (exclusion) {
      report(label, 0, exclusion);
    } else {
      let directory = false;
      try {
        directory = (await lstat(path)).isDirectory();
      } catch {
        /* scan reports safely */
      }
      await scan(path, directory ? label : `${label}/${safeFilename(basename(path), matcher)}`);
    }
  }
  return { status: incomplete ? 2 : findings ? 1 : 0, diagnostics };
}

const HELP = `Usage:
  node sanitize.mjs sanitize [--repo-root ROOT] [--map ROOT=ALIAS ...]
  node sanitize.mjs check [--repo-root ROOT] [--map ROOT=ALIAS ...] -- FILE_OR_DIR ...

sanitize reads raw UTF-8 stdin and writes sanitized stdout only. It never runs commands,
opens input files, writes files, or spools raw input. check is read-only and scans only
explicit scopes, recursively in sorted order, without extension filtering.
ROOT must be an absolute Unix, drive-qualified Windows, or backslash UNC path (not a
volume root). ALIAS is NAME or <NAME>, matching [A-Z][A-Z0-9_]*. Repeat --map to add
roots. Longest root wins; conflicting replacements for the same root are rejected.
The default repo root is resolved from this tool's location, not the working directory.
Checkout paths become repo-relative (root becomes .); maps become <ALIAS>/suffix.
Native os home/temp roots (lexical and realpath), /Users/name, /home/name, /tmp,
/private/tmp, /var/folders, /private/var/folders, Windows Users/Temp conventions and
backslash UNC paths become <PRIVATE_PATH> for the complete recognized path token.
Native/forward/JSON-escaped Windows separators and file:// URLs are supported.
Quote path tokens containing spaces; explicit root spaces and account-name spaces
are also recognized. Unquoted tokens end at whitespace or common prose delimiters.
Stack :line:column suffixes are preserved. Non-file URLs, unrelated API/container
paths and unknown absolute roots are left unchanged: this is NOT a universal secret
scanner. Use explicit maps for other local roots; inspect output before publication.
UTF-8 decoding is fatal, with a 1 MiB byte limit per line (including CR, excluding LF).
sanitize preserves control characters without interpreting or stripping them; they do
not cause BINARY rejection. LF separates lines; CR counts toward the line byte limit.
Only complete validated lines are emitted; earlier sanitized lines may survive failure.
check limits each file to 8 MiB and treats NUL, DEL and non-text C0 controls as binary.
It reports only scope-N/relative-filename:line CODE, never source lines or absolute scan roots.
Symlinks (including scope ancestors), special files, .env* files/directories, unreadable,
binary, invalid UTF-8 and over-limit files make checking incomplete. Scope trees must
remain stable while scanning; this is not an adversarial filesystem snapshot.
Exit status: sanitize 0 success / 2 error; check 0 clean / 1 findings / 2 incomplete/error.
Options must precede --; check requires -- and at least one explicit scope.
`;

export async function runCli(
  args,
  { input = process.stdin, output = process.stdout, error = process.stderr } = {},
) {
  let outputFailed = false;
  const onError = () => {
    outputFailed = true;
  };
  output.on('error', onError);
  // Diagnostics must themselves tolerate a closed stderr, without a raw exception stack.
  const ignoreError = () => {};
  error.on('error', ignoreError);
  try {
    if (args.length === 1 && args[0] === '--help') {
      await write(output, HELP);
      return 0;
    }
    const [command, ...rest] = args;
    if (!['sanitize', 'check'].includes(command)) fail('INVALID_USAGE');
    if (rest.length === 1 && rest[0] === '--help') {
      await write(output, HELP);
      return 0;
    }
    const options = { maps: [] };
    let scopes;
    for (let index = 0; index < rest.length; index++) {
      const arg = rest[index];
      if (arg === '--' && command === 'check') {
        scopes = rest.slice(index + 1);
        break;
      }
      if (!['--repo-root', '--map'].includes(arg) || index + 1 >= rest.length)
        fail('INVALID_USAGE');
      const value = rest[++index];
      if (arg === '--repo-root') {
        if (options.repoRoot !== undefined) fail('INVALID_USAGE');
        options.repoRoot = value;
      } else {
        const equal = value.lastIndexOf('=');
        if (equal <= 0) fail('INVALID_MAP');
        options.maps.push({ root: value.slice(0, equal), alias: value.slice(equal + 1) });
      }
    }
    const matcher = createMatcher(options);
    if (command === 'sanitize') {
      await sanitizeStream(input, output, { matcher });
      return 0;
    }
    if (!scopes?.length) fail('INVALID_SCOPE');
    const result = await checkPaths(scopes, { matcher });
    for (const diagnostic of result.diagnostics) await write(output, `${diagnostic}\n`);
    if (outputFailed) fail('OUTPUT_ERROR');
    return result.status;
  } catch (caught) {
    const code = caught instanceof SafeError ? caught.code : 'INTERNAL_ERROR';
    try {
      await write(error, `evidence-paths: ${code}\n`);
    } catch {
      /* no unsafe fallback */
    }
    return 2;
  } finally {
    output.off('error', onError);
    error.off('error', ignoreError);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli(process.argv.slice(2)).then(status => {
    process.exitCode = status;
  });
}
