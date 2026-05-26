import { UseAopMethod } from './useAopMethod.ts';
import { UseFilter } from './useFilter.ts';
import { UseFilterGlobal } from './useFilterGlobal.ts';
import { UseGuard } from './useGuard.ts';
import { UseGuardGlobal } from './useGuardGlobal.ts';
import { UseInterceptor } from './useInterceptor.ts';
import { UseInterceptorGlobal } from './useInterceptorGlobal.ts';
import { UseMiddleware } from './useMiddleware.ts';
import { UseMiddlewareGlobal } from './useMiddlewareGlobal.ts';
import { UsePipe } from './usePipe.ts';
import { UsePipeGlobal } from './usePipeGlobal.ts';

export const Aspect = {
  aopMethod: UseAopMethod,
  filter: UseFilter,
  filterGlobal: UseFilterGlobal,
  guard: UseGuard,
  guardGlobal: UseGuardGlobal,
  interceptor: UseInterceptor,
  interceptorGlobal: UseInterceptorGlobal,
  middleware: UseMiddleware,
  middlewareGlobal: UseMiddlewareGlobal,
  pipe: UsePipe,
  pipeGlobal: UsePipeGlobal,
};
