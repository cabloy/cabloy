export interface ICaptchaSceneRecord {}

export interface ICaptchaProviderRecord {}

export interface ICaptchaData {
  id: string;
  provider: keyof ICaptchaProviderRecord | string;
  token?: unknown;
  payload?: unknown;
  status?: 'accepted' | 'rejected' | 'unknown' | 'limited';
  serverNow?: number;
  expiresAt?: number;
  resendAt?: number;
  retryAt?: number;
}
