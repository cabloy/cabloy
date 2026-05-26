/* eslint-disable no-console */
import { cascadeExtend, cascadeExtendKeys } from '../src/index.ts';

const scope = {
  group: true,
  mobile: true,
  small: true,
  view: true,
};
const source = {
  'ebParams.mobile': {
    size: 'small',
    scene: 'mobile',
    group: true,
  },
  'ebParams': {
    size: 'large',
    scene: 'pc',
    name: 'yang',
  },
  'ebParams.pc': {
    size: 'large',
    scene: 'pc',
    name: 'kevin_pc',
    group: true,
  },
  'ebParams.mobile.view': {
    name: 'kevin_mobile_view',
  },
  'ebParams.view': {
    name: 'kevin_view',
  },
  'ebParams.pc.view': {
    size: 'large',
    scene: 'pc',
  },
};
// { size: 'small', scene: 'mobile', name: 'kevin_mobile_view', group: true }

console.log(new Date());
let resKeys;
let res;
for (let i = 0; i < 100; i++) {
  resKeys = cascadeExtendKeys(scope, source, 'ebParams');
  res = cascadeExtend(scope, source, 'ebParams');
}
console.log(new Date());
console.log(resKeys);
console.log(res);
