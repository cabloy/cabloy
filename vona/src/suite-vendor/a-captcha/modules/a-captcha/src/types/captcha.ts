import type { ICaptchaBinding, ICaptchaProviderRecord } from './captchaProvider.ts';
import type { ICaptchaSceneRecord } from './captchaScene.ts';
import 'vona';

export interface ICaptchaDataCache {
  scene: keyof ICaptchaSceneRecord;
  provider: keyof ICaptchaProviderRecord;
  token?: unknown;
  token2?: string;
  revision?: string;
  bound?: {
    binding: ICaptchaBinding;
    scope: string;
    state: 'pending' | 'active';
    expiresAt: number;
    resendAt: number;
    attemptsRemaining: number;
    version: number;
  };
}

export interface ICaptchaData {
  id: string;
  provider: keyof ICaptchaProviderRecord;
  token?: unknown;
  payload: unknown;
  status?: 'accepted' | 'rejected' | 'unknown' | 'limited';
  expiresAt?: number;
  resendAt?: number;
  retryAt?: number;
}

declare module 'vona' {
  export interface ILoggerChildRecord {
    captcha: never;
  }
}
