import type { ICaptchaProviderRecord } from './captchaProvider.ts';
import type { ICaptchaSceneRecord } from './captchaScene.ts';
import 'vona';

export interface ICaptchaDataCache {
  scene: keyof ICaptchaSceneRecord;
  provider: keyof ICaptchaProviderRecord;
  token: string;
}

export interface ICaptchaData {
  id: string;
  provider: keyof ICaptchaProviderRecord;
  token?: unknown;
  payload: unknown;
  status?: 'accepted' | 'rejected' | 'unknown' | 'limited';
  serverNow?: number;
  expiresAt?: number;
  resendAt?: number;
  retryAt?: number;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    captcha: never;
  }
}
