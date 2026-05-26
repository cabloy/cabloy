import type {
  TypeBootstrapOptionsConfig,
  TypeBootstrapOptionsLocales,
  TypeBootstrapOptionsModulesMeta,
} from '../application/app.ts';
import type { AppMonkeyConstructable } from './monkey.ts';

export interface BootstrapOptions {
  modulesMeta: TypeBootstrapOptionsModulesMeta;
  locales: TypeBootstrapOptionsLocales;
  config: TypeBootstrapOptionsConfig;
  env: Partial<NodeJS.ProcessEnv>;
  AppMonkey?: AppMonkeyConstructable;
}
