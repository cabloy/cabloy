import * as p from '@clack/prompts';
import pc from 'picocolors';

import { isValidPackageName, toValidPackageName } from './utils.ts';

export interface PromptResult {
  projectName: string;
  force: boolean;
}

export async function runPrompts(options: {
  projectName?: string;
  force?: boolean;
}): Promise<PromptResult | null> {
  p.intro(pc.bgCyan(pc.black(' Create Cabloy ')));

  let projectName: string;

  if (options.projectName) {
    projectName = isValidPackageName(options.projectName)
      ? options.projectName
      : toValidPackageName(options.projectName);
  } else {
    const name = await p.text({
      message: 'Project name',
      placeholder: 'cabloy-app',
      validate: v => {
        if (!v.trim()) {
          return 'Project name is required';
        }
        if (!isValidPackageName(v) && !isValidPackageName(toValidPackageName(v))) {
          return 'Invalid package name';
        }
        return undefined;
      },
    });

    if (p.isCancel(name)) {
      p.cancel('Operation cancelled');
      return null;
    }

    projectName = isValidPackageName(name) ? name : toValidPackageName(name);
  }

  return {
    projectName,
    force: options.force ?? false,
  };
}
