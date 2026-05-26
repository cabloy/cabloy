import { closeApp, createGeneralApp } from 'vona-core';

const argv = process.argv.slice(2);
const projectPath = argv[0];

await dbResetRun(projectPath);

async function dbResetRun(projectPath: string) {
  await createGeneralApp(projectPath);
  await closeApp();
}
