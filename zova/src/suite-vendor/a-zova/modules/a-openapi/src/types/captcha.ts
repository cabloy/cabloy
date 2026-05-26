export interface ICaptchaSceneRecord {}

export interface ICaptchaProviderRecord {}

export interface ICaptchaData {
  id: string;
  provider: keyof ICaptchaProviderRecord | string;
  token?: unknown;
  payload?: unknown;
}
