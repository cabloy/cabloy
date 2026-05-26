export interface CookieOptions {
  expires?: number | string | Date;
  path?: string;
  domain?: string;
  sameSite?: 'Strict' | 'Lax';
  httpOnly?: boolean;
  secure?: boolean;
  other?: string;
}
