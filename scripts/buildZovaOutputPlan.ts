import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Run against the real application directory with the build's private runtime.
// Persist only this allowlist, never loaded environment or stdout as a control channel.
const [appDir, flavor, resultFile, appMode = 'ssr'] = process.argv.slice(2);
if (appMode !== 'ssr' && appMode !== 'spa') throw new Error('Invalid build app mode');
if (!appDir || !flavor || !resultFile)
  throw new Error('Output plan requires an application directory, flavor and result file');
const loaderUrl = pathToFileURL(path.join(appDir, 'packages-utils/zova-vite/src/configUtils.ts'));
const { createConfigUtils } = await import(loaderUrl.href);
createConfigUtils(
  { flavor, mode: 'production', appMode },
  { appDir, runtimeDir: process.env.ZOVA_RUNTIME_DIR || '.zova' },
).loadEnvs();
const plan = {
  appVersion: process.env.APP_VERSION ?? '',
  buildOutDir: process.env.BUILD_OUTDIR ?? '',
  buildCopyDist: process.env.BUILD_COPY_DIST ?? '',
  buildCopyRelease: process.env.BUILD_COPY_RELEASE ?? '',
  buildRestCopyDist: process.env.BUILD_REST_COPY_DIST ?? '',
};
const json = JSON.stringify(plan);
if (Buffer.byteLength(json, 'utf8') > 64 * 1024)
  throw new Error('Output-plan result exceeds 64 KiB');
await writeFile(resultFile, json, { flag: 'wx', mode: 0o600 });
