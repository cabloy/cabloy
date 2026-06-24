import type { IModuleInfo, ISuite } from '@cabloy/module-info';

export function parseSuiteInfoCanonical(
  helper: { parseSuiteInfo(suiteName: string): IModuleInfo },
  suiteName: string,
  suiteRole = 'suite',
) {
  const suiteInfo = helper.parseSuiteInfo(suiteName);
  if (suiteInfo.relativeName !== suiteName) {
    throw new Error(
      `${suiteRole} name must use the canonical relative suite name: ${suiteInfo.relativeName}. Received: ${suiteName}. Use names like a-training, not package names or extra-suffixed names.`,
    );
  }
  return suiteInfo;
}

export function findSuiteCanonical(
  helper: {
    parseSuiteInfo(suiteName: string): IModuleInfo;
    findSuite(suiteName: string): ISuite | undefined;
  },
  suiteName: string,
  suiteRole = 'suite',
) {
  const suiteInfo = parseSuiteInfoCanonical(helper, suiteName, suiteRole);
  const suite = helper.findSuite(suiteInfo.relativeName);
  if (!suite) {
    throw new Error(`${suiteRole} does not exist: ${suiteName}`);
  }
  return suite;
}
