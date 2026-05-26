import type { ZovaSys } from '../../core/sys/sys.ts';

declare global {
  interface Window {
    sys: ZovaSys;
  }
}
