import type { ZovaSys } from '../../../core/sys/sys.ts';

export type TypeModuleConfig<T extends (sys: ZovaSys) => object> = ReturnType<T>;
