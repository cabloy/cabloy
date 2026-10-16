import '../../../a-model/test/lib/modelLoader.mjs';
import { registerHooks } from 'node:module';

// Reuse the model fixture's container-free imports, but retain the real deep
// option merge needed by $useStateLocalAsync (including its default factory).
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'zova') return { url: 'tabs-test:zova', shortCircuit: true };
    if (specifier === 'localforage') {
      return nextResolve(specifier, {
        ...context,
        parentURL: new URL('../../../a-model/test/lib/modelPersistence.test.ts', import.meta.url)
          .href,
      });
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'tabs-test:zova') {
      return {
        format: 'module',
        shortCircuit: true,
        source: `
          import { extend } from ${JSON.stringify(import.meta.resolve('@cabloy/extend'))};
          export class BeanBase {}
          export class BeanSimple {}
          export const SymbolBeanFullName = Symbol.for('model-test-bean');
          export const cast = value => value;
          export const deepExtend = (...values) => extend(true, ...values);
        `,
      };
    }
    return nextLoad(url, context);
  },
});
