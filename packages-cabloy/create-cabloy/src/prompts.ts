import * as p from '@clack/prompts';
import pc from 'picocolors';

import { isValidPackageName, toValidPackageName } from './utils.ts';

export interface PromptResult {
  projectName: string | null; // null means current directory
  force: boolean;
}

export async function runPrompts(options: {
  projectName?: string;
  force?: boolean;
}): Promise<PromptResult | null> {
  p.intro(pc.bgCyan(pc.black(' Create Cabloy ')));

  let projectName: string | null = null;

  if (options.projectName) {
    projectName = isValidPackageName(options.projectName)
      ? options.projectName
      : toValidPackageName(options.projectName);
  } else {
    const name = await p.text({
      message: 'Project name (leave empty to use current directory)',
      placeholder: 'cabloy-app',
      validate: v => {
        if (v.trim() && !isValidPackageName(v) && !isValidPackageName(toValidPackageName(v))) {
          return 'Invalid package name';
        }
        return undefined;
      },
    });

    if (p.isCancel(name)) {
      p.cancel('Operation cancelled');
      return null;
    }

    if (name.trim()) {
      projectName = isValidPackageName(name) ? name : toValidPackageName(name);
    } else {
      projectName = null; // use current directory
    }
  }

  return {
    projectName,
    force: options.force ?? false,
  };
}
