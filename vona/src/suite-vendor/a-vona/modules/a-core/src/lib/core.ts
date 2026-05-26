import type { IInterceptorOptionsCaptchaVerify } from 'vona-module-a-captcha';
import type { IFilterOptionsError } from 'vona-module-a-error';
import type { IAopMethodOptionsLog } from 'vona-module-a-logger';
import type { TypeUseOnionOmitOptionsGlobal } from 'vona-module-a-onion';
import type { IAopMethodOptionsTransaction } from 'vona-module-a-orm';
import type { IInterceptorOptionsUpload } from 'vona-module-a-upload';

import { Aspect } from 'vona-module-a-aspect';

import type { IMiddlewareOptionsGate } from '../bean/middleware.gate.ts';

function Gate(
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IMiddlewareOptionsGate>>,
): ClassDecorator & MethodDecorator {
  return Aspect.middlewareGlobal('a-core:gate', options);
}

function Error(
  options?: Partial<TypeUseOnionOmitOptionsGlobal<IFilterOptionsError>>,
): ClassDecorator & MethodDecorator {
  return Aspect.filterGlobal('a-error:error', options);
}

function Log(options?: Partial<IAopMethodOptionsLog>): MethodDecorator {
  return Aspect.aopMethod('a-logger:log', options);
}

function Transaction(options?: Partial<IAopMethodOptionsTransaction>): MethodDecorator {
  return Aspect.aopMethod('a-orm:transaction', options);
}

function CaptchaVerify(options?: Partial<IInterceptorOptionsCaptchaVerify>): MethodDecorator {
  return Aspect.interceptor('a-captcha:captchaVerify', options);
}

function FileUpload(options?: Partial<IInterceptorOptionsUpload>): MethodDecorator {
  return Aspect.interceptor('a-upload:upload', options);
}

function Serializer(enable: boolean = true): ClassDecorator & MethodDecorator {
  return Aspect.interceptor('a-serialization:serializer', { enable });
}

export const Core = {
  gate: Gate,
  error: Error,
  log: Log,
  transaction: Transaction,
  captchaVerify: CaptchaVerify,
  fileUpload: FileUpload,
  serializer: Serializer,
};
