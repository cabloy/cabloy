export interface IJwtAdapter {
  getJwtInfo(): Promise<IJwtInfo | undefined>;
  refreshAuthToken(refreshToken: string): Promise<IJwtInfo>;
}

export interface IJwtInfo {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  expireTime?: number;
}
