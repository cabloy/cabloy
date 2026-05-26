import type z from 'zod';

import { setLocaleAdapter, setLocaleErrors, translateError } from '@cabloy/zod-errors-custom';
import { ZodMetadata } from '@cabloy/zod-openapi';
import { setParseAdapter } from '@cabloy/zod-query';

import type { ILocaleRecord } from '../bean/resource/locale/type.ts';
import type { VonaApplication } from '../core/application.ts';

import { useApp } from '../framework/useApp.ts';

export type ZodLocaleError = () => { localeError: z.core.$ZodErrorMap };
export type ZodLocaleErrors = Record<keyof ILocaleRecord, ZodLocaleError>;

export function zodEnhance() {
  setLocaleAdapter((text: string, iss?: object) => {
    const app = useApp();
    return translateError(
      (text: string, ...args: any[]) => {
        return app.meta.text(text, ...args);
      },
      text,
      iss,
    );
  });
  setParseAdapter(ZodMetadata);
}

export function zodSetLocaleErrors(
  app: VonaApplication,
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
