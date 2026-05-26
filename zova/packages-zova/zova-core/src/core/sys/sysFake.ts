import type { ZovaSys } from './sys.ts';

let _sys: ZovaSys;

export function getSys() {
  return _sys;
}

export function setSys(sys: ZovaSys) {
  _sys = sys;
}
