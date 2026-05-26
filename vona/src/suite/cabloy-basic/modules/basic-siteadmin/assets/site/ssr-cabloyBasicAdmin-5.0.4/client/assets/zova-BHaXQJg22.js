import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
//#region packages-utils/mutate-on-copy/src/index.ts
function mutate(target, fn) {
	if (!target) return target;
	const copyState = Array.isArray(target) ? target.slice() : Object.assign({}, target);
	const res = fn(copyState);
	return res === void 0 ? copyState : res;
}
var init_src = __esmMin((() => {}));
//#endregion
export { mutate as n, init_src as t };
