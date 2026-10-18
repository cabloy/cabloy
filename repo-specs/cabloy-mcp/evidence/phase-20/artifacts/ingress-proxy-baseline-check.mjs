import { createRequire } from 'node:module';
import { readFileSync, realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Read-only compiler-host comparison; no emit, tsconfig write or checkout replacement.
try {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
  const project = resolve(root, 'vona');
  const require = createRequire(resolve(project, 'package.json'));
  const ts = require('typescript');
  const canonical = file => {
    try { return realpathSync(file); } catch { return resolve(file); }
  };
  const metadata = 'vona/src/suite-vendor/a-test/modules/test-vona/src/.metadata/index.ts';
  const added = [
    'vona/src/suite-vendor/a-test/modules/test-vona/src/bean/aop.mcpIngressProbe.ts',
    'vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/ingressProxy.test.ts',
  ];
  const blocked = new Set(added.map(file => canonical(resolve(root, file))));
  const metaPath = canonical(resolve(root, metadata));
  const old = spawnSync('git', ['show', `HEAD:${metadata}`], { cwd: root });
  if (old.status !== 0) throw new Error();
  const baselineMetadata = new TextDecoder('utf-8', { fatal: true }).decode(old.stdout);
  const configPath = resolve(project, 'src/suite-vendor/a-test/modules/test-vona/tsconfig.json');
  const sourceHash = file => createHash('sha256').update(readFileSync(resolve(root, file))).digest('hex');
  const hashesBefore = [metadata, ...added].map(sourceHash);
  const portable = file => file ? relative(root, canonical(file)).replaceAll('\\', '/') : undefined;
  const signature = diagnostic => ({
    file: portable(diagnostic.file?.fileName),
    start: diagnostic.start,
    length: diagnostic.length,
    category: diagnostic.category,
    code: diagnostic.code,
    message: diagnostic.messageText,
    related: diagnostic.relatedInformation?.map(signature),
  });
  function inspect(baseline) {
    const system = {
      ...ts.sys,
      getCurrentDirectory: () => project,
      fileExists: file => !(baseline && blocked.has(canonical(file))) && ts.sys.fileExists(file),
      readFile: file => baseline && blocked.has(canonical(file)) ? undefined
        : baseline && canonical(file) === metaPath ? baselineMetadata : ts.sys.readFile(file),
    };
    const read = ts.readConfigFile(configPath, system.readFile);
    if (read.error) throw new Error();
    const parsed = ts.parseJsonConfigFileContent(read.config, system, dirname(configPath), {
      noEmit: true, composite: false, incremental: false,
    }, configPath);
    const roots = parsed.fileNames.filter(file => !(baseline && blocked.has(canonical(file))));
    const host = ts.createCompilerHost(parsed.options);
    host.getCurrentDirectory = system.getCurrentDirectory;
    host.fileExists = system.fileExists;
    host.readFile = system.readFile;
    host.writeFile = () => { throw new Error('emit_prohibited'); };
    host.getSourceFile = (file, languageVersion) => {
      const source = system.readFile(file);
      return source === undefined ? undefined : ts.createSourceFile(file, source, languageVersion, true);
    };
    const program = ts.createProgram(roots, parsed.options, host);
    const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
    const signatures = diagnostics.map(signature).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    const codes = {};
    for (const diagnostic of diagnostics) codes[diagnostic.code] = (codes[diagnostic.code] ?? 0) + 1;
    const formatted = ts.formatDiagnostics(diagnostics, {
      getCurrentDirectory: () => project,
      getCanonicalFileName: file => file,
      getNewLine: () => '\n',
    });
    return { signatures, codes, formatted, roots: roots.length };
  }
  const baseline = inspect(true);
  globalThis.gc?.();
  const current = inspect(false);
  const priorLog = readFileSync(resolve(root, 'repo-specs/cabloy-mcp/evidence/phase-20/artifacts/ingress-proxy-owner-types-1.log'), 'utf8');
  const priorDiagnosticText = priorLog.slice(priorLog.indexOf('\n') + 1, priorLog.lastIndexOf('\nproducer_exit=')).trim();
  const sameAsPriorCli = current.formatted.trim() === priorDiagnosticText;
  const equal = JSON.stringify(baseline.signatures) === JSON.stringify(current.signatures);
  const unchanged = JSON.stringify(hashesBefore) === JSON.stringify([metadata, ...added].map(sourceHash));
  const passed = equal && sameAsPriorCli && unchanged && current.signatures.length === 35;
  console.log(JSON.stringify({
    compiler: ts.version,
    scope: 'test-vona owner module; same installed dependencies and tsconfig',
    overlay: { metadata, excludedNewFiles: added },
    baselineRoots: baseline.roots, currentRoots: current.roots,
    baselineDiagnostics: baseline.signatures.length, currentDiagnostics: current.signatures.length,
    diagnosticCodes: current.codes, completeSignaturesEqual: equal,
    currentDiagnosticsEqualPriorCli: sameAsPriorCli, sourceBytesUnchanged: unchanged,
    baselineSignatureSha256: createHash('sha256').update(JSON.stringify(baseline.signatures)).digest('hex'),
    currentSignatureSha256: createHash('sha256').update(JSON.stringify(current.signatures)).digest('hex'),
    baselineSignatures: baseline.signatures, currentSignatures: current.signatures,
    outcome: passed ? 'baseline_debt_equal_not_clean' : 'comparison_failed',
  }, null, 2));
  if (!passed) process.exitCode = 1;
} catch {
  console.error('ingress_proxy_baseline_comparison_failed');
  process.exitCode = 1;
}
