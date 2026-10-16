import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

// Keep framework container/decorator bootstrapping out of the Node fixture. All
// persistence, Query, QueryObserver, queue and state methods are production code.
const fixtures = {
  'zova':
    "export class BeanBase {} export class BeanSimple {} export const SymbolBeanFullName = Symbol.for('model-test-bean'); export const cast = value => value; export const deepExtend = (...values) => Object.assign({}, ...values);",
  'zova-module-a-bean': 'export const Service = () => target => target;',
  'model-test-metadata': "export const __ThisModule__ = 'a-model';",
};
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier in fixtures) return { url: `model-test:${specifier}`, shortCircuit: true };
    if (specifier.endsWith('/.metadata/this.js'))
      return { url: 'model-test:model-test-metadata', shortCircuit: true };
    if (specifier.startsWith('.') && specifier.endsWith('.js') && context.parentURL) {
      const target = new URL(`${specifier.slice(0, -3)}.ts`, context.parentURL);
      if (existsSync(fileURLToPath(target))) return nextResolve(target.href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith('model-test:')) {
      return {
        format: 'module',
        source: fixtures[url.slice('model-test:'.length)],
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
