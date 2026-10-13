import { closeApp, createGeneralApp } from 'vona-core';

const argv = process.argv.slice(2);
const projectPath = argv[0];

await dbResetRun(projectPath);

async function dbResetRun(projectPath: string) {
  if (process.env.META_MODE !== 'dev') {
    throw new Error('db:reset requires dev mode');
  }
  const previousReset = process.env.VONA_DB_RESET;
  process.env.VONA_DB_RESET = 'true';
  try {
    await createGeneralApp(projectPath);
  } finally {
    try {
      await closeApp();
    } finally {
      if (previousReset === undefined) delete process.env.VONA_DB_RESET;
      else process.env.VONA_DB_RESET = previousReset;
    }
  }
}
