import type { VonaApplication } from 'vona-core';

import { catchError, sleep } from '@cabloy/utils';
import TableClass from 'cli-table3';
import fse from 'fs-extra';
import { globby } from 'globby';
import { createWriteStream } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { run } from 'node:test';
import { lcov, spec } from 'node:test/reporters';
import { fileURLToPath } from 'node:url';
import { cast, createGeneralApp } from 'vona-core';
import whyIsNodeRunning from 'why-is-node-running';

const argv = process.argv.slice(2);
const projectPath = argv[0];
const coverage = argv[1] === 'true';
const patterns = (argv[2] || '').split(',');

await testRun(projectPath, coverage, patterns);

async function testRun(projectPath: string, coverage: boolean, patterns: string[]) {
  // patterns ignore
  const patternsIgnore =
    !coverage && process.env.TEST_PATTERNS_IGNORE
      ? process.env.TEST_PATTERNS_IGNORE.split(',')
      : undefined;
  // files
  const files = await globby(patterns, {
    cwd: projectPath,
    ignore: patternsIgnore,
  });
  if (process.env.TEST_ONLY === 'true') {
    files.push(resolveTemplatePath('test/done-only.test.js'));
  } else {
    files.push(resolveTemplatePath('test/done.test.js'));
  }
  // coverage
  let coverageIncludeGlobs: string[] = [];
  if (coverage) {
    if (fse.existsSync(path.join(projectPath, 'packages-vona/vona-core'))) {
      coverageIncludeGlobs = coverageIncludeGlobs.concat([
        'packages-vona/vona-core/**/*.ts',
        'src/suite-vendor/a-vona/**/*.ts',
      ]);
    } else {
      coverageIncludeGlobs = coverageIncludeGlobs.concat([
        'src/module/**/*.ts',
        'src/suite/**/*.ts',
      ]);
    }
  }
  const coverageExcludeGlobs = [
    'src/module/*/cli/**/*.ts',
    'src/module/*/templates/**/*.ts',
    'src/suite/*/modules/*/cli/**/*.ts',
    'src/suite/*/modules/*/templates/**/*.ts',
    'src/module-vendor/*/cli/**/*.ts',
    'src/module-vendor/*/templates/**/*.ts',
    'src/suite-vendor/*/modules/*/cli/**/*.ts',
    'src/suite-vendor/*/modules/*/templates/**/*.ts',
  ];
  // app
  const app: VonaApplication = await createGeneralApp(projectPath);
  let testError: unknown;
  let closeError: unknown;
  let closePromise: Promise<void> | undefined;
  const closeApplication = async () => {
    const [_, error] = await catchError(() => app.close());
    closeError = error;
    // handles
    if (process.env.TEST_WHYISNODERUNNING === 'true') {
      await sleep(2000);
      const handles = (process as any)._getActiveHandles();
      if (handles.length > 3) {
        whyIsNodeRunning();
      }
    }
  };
  const closeApplicationOnce = () => {
    return (closePromise ??= closeApplication());
  };
  try {
    // concurrency
    const concurrency = await prepareConcurrency(app);
    const testStream = run({
      isolation: 'none',
      concurrency,
      only: process.env.TEST_ONLY === 'true',
      coverage,
      coverageIncludeGlobs,
      coverageExcludeGlobs,
      cwd: projectPath,
      files,
      setup: async () => {},
    } as any)
      .on('test:coverage', data => {
        outputCoverageReport(data.summary.totals);
      })
      .on('test:pass', t => {
        if (t.name === '---done---') {
          void closeApplicationOnce();
        }
      });
    const summaryPromise = waitForTestSummary(testStream);
    if (coverage) {
      const reporterDir = path.join(projectPath, 'coverage');
      fse.ensureDirSync(reporterDir);
      const reporterLcov = createWriteStream(path.join(reporterDir, 'lcov.info'));
      testStream.compose(lcov).pipe(reporterLcov);
    } else {
      testStream.compose(spec).pipe(process.stdout);
    }

    const summarySuccess = await summaryPromise;
    if (!summarySuccess) {
      throw new Error('node:test reported failed tests');
    }
  } catch (error) {
    testError = error;
  } finally {
    await closeApplicationOnce();
  }
  if (testError) {
    if (closeError) console.error(closeError);
    throw toError(testError);
  }
  if (closeError) {
    throw toError(closeError);
  }
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error));
}

function waitForTestSummary(testStream: ReturnType<typeof run>) {
  return new Promise<boolean>((resolve, reject) => {
    testStream.once('test:summary', summary => resolve(summary.success)).once('error', reject);
  });
}

async function prepareConcurrency(app: VonaApplication) {
  // check
  let concurrency = 1;
  if (process.env.TEST_CONCURRENCY === 'true') {
    concurrency = os.cpus().length;
  } else if (process.env.TEST_CONCURRENCY === 'false') {
    concurrency = 1;
  } else {
    concurrency = Number.parseInt(process.env.TEST_CONCURRENCY!);
  }
  if (concurrency === 1) return concurrency;
  // check again
  return await cast(app.bean).executor.mockCtx(async () => {
    const db = cast(app.bean).database.getDb();
    return db.dialect.capabilities.level ? concurrency : 1;
  });
}

function outputCoverageReport(totals: CoverageTotals) {
  // table
  const table = new TableClass({
    head: ['', 'Total', 'Covered', 'Percent'],
    colWidths: [15, 15, 15, 25],
  });
  table.push(['Lines', totals.totalLineCount, totals.coveredLineCount, totals.coveredLinePercent]);
  table.push([
    'Branches',
    totals.totalBranchCount,
    totals.coveredBranchCount,
    totals.coveredBranchPercent,
  ]);
  table.push([
    'Functions',
    totals.totalFunctionCount,
    totals.coveredFunctionCount,
    totals.coveredFunctionPercent,
  ]);
  // eslint-disable-next-line
  console.log(table.toString());
}

interface CoverageTotals {
  /**
   * The total number of lines.
   */
  totalLineCount: number;
  /**
   * The total number of branches.
   */
  totalBranchCount: number;
  /**
   * The total number of functions.
   */
  totalFunctionCount: number;
  /**
   * The number of covered lines.
   */
  coveredLineCount: number;
  /**
   * The number of covered branches.
   */
  coveredBranchCount: number;
  /**
   * The number of covered functions.
   */
  coveredFunctionCount: number;
  /**
   * The percentage of lines covered.
   */
  coveredLinePercent: number;
  /**
   * The percentage of branches covered.
   */
  coveredBranchPercent: number;
  /**
   * The percentage of functions covered.
   */
  coveredFunctionPercent: number;
}

function resolveTemplatePath(file: string) {
  const url = new URL(path.join('../templates', file), import.meta.url);
  return fileURLToPath(url);
}
