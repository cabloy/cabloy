/* eslint-disable no-console */
import path from 'node:path';

import { getEnvFiles, loadEnvs } from '../src/index.ts';

const meta = { serverEnv: 'test' };
const envDir = path.join(process.cwd(), 'src/backend/config/env');
const configDir = path.join(process.cwd(), 'src/backend/config/config');

const envFiles = getEnvFiles(meta, envDir, '.env');
console.log(envFiles);

const configFiles = getEnvFiles(meta, configDir, 'config', '.ts');
console.log(configFiles);

const env = loadEnvs(meta, envDir);
console.log(env);
// console.log(process.env);
