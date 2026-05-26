import type z from 'zod';

import { setLocaleAdapter, setLocaleErrors, translateError } from '@cabloy/zod-errors-custom';
import { ZodMetadata } from '@cabloy/zod-openapi';
import { setParseAdapter } from '@cabloy/zod-query';

import type { ILocaleRecord } from '../bean/resource/locale/type.ts';
import type { ZovaApplication } from '../core/app/application.ts';

export type ZodLocaleError = () => { localeError: z.core.$ZodErrorMap };
export type ZodLocaleErrors = Record<keyof ILocaleRecord, ZodLocaleError>;

export function zodEnhance(app: ZovaApplication) {
  setLocaleAdapter((text: string, iss?: object) => {
    return translateError(
      (text: string, ...args: any[]) => {
        return app.meta.text(text, ...args);
      },
      text,
      iss,
    );
  });
}

export function zodEnhanceSys() {
  setParseAdapter(ZodMetadata);
}

export function zodSetLocaleErrors(
  app: ZovaApplication,
  localeErrors: ZodLocaleErrors,
  localeDefault?: string,
) {
  setLocaleErrors(
    () => {
      return app.meta.locale.current;
    },
    localeErrors,
    localeDefault,
  );
}
