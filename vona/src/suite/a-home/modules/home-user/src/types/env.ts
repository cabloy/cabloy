declare module 'vona' {
  export interface VonaConfigEnv {
    HOME_USER_PASSWORD_DEFAULT_ADMIN: string | undefined;
    HOME_USER_DISABLE_BOOTSTRAP_SYSTEM_ADMIN: string | undefined;
    HOME_USER_DISABLE_USER_ADMIN: string | undefined;
    HOME_USER_BUILTIN_ROLE_REGISTERED_USER_SITE_IDS: string | undefined;
    HOME_USER_BUILTIN_ROLE_SYSTEM_ADMIN_SITE_IDS: string | undefined;
  }
}

export {};
