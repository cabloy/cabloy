import type { ZovaSys } from 'zova';
import type { IIconRecord } from 'zova-module-a-icon';

export const config = (_sys: ZovaSys) => {
  return {
    model: {
      alert: {
        icons: {
          success: ':outline:check-circle-outline' as keyof IIconRecord,
          info: ':outline:alert-outline' as keyof IIconRecord,
          warning: ':outline:alert-outline' as keyof IIconRecord,
          error: ':outline:alert-outline' as keyof IIconRecord,
        },
        default: {
          maxWidth: 360,
          closeOnBackdrop: true,
          closeOnEscape: true,
          showCloseButton: false,
        },
      },
      confirm: {
        icons: {
          confirm: ':outline:alert-outline' as keyof IIconRecord,
        },
        default: {
          maxWidth: 360,
          closeOnBackdrop: true,
          closeOnEscape: true,
          showCloseButton: false,
        },
      },
      prompt: {
        icons: {
          prompt: ':outline:alert-outline' as keyof IIconRecord,
        },
        default: {
          maxWidth: 360,
          closeOnBackdrop: true,
          closeOnEscape: true,
          showCloseButton: false,
        },
      },
      dialog: {
        default: {
          maxWidth: 640,
          maxHeight: 'calc(100vh - 2rem)',
          closeOnBackdrop: false,
          closeOnEscape: true,
          showCloseButton: true,
        },
      },
    },
  };
};
