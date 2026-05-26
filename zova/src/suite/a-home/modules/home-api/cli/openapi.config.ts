import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [
        /^Home_*/,
        /^HomeBaseMenu_*/,
        /^HomeBasePermission_*/,
        /^HomeUserPassport_*/,
        /^TestSsrToolOne_*/,
        /^Captcha_*/,
      ],
    },
  };
}
