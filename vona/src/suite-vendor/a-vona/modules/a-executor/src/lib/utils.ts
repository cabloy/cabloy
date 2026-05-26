export function __delegateProperties(ctx, ctxCaller) {
  for (const property of ['state']) {
    __delegateProperty(ctx, ctxCaller, property);
  }
  for (const property of ['headers']) {
    __delegateProperty(ctx.request, ctxCaller.request, property);
    // if (ctx.request[property]) req[property] = ctx.request[property];
  }
}

export function __delegateProperty(ctx, ctxCaller, property) {
  if (!ctxCaller[property]) ctxCaller[property] = {};
  ctx[property] = ctxCaller[property];
}

// export function delegateProperty(ctx, ctxCaller, property) {
//   if (!ctxCaller[property]) return;
//   if (!ctx[property]) ctx[property] = {};
//   for (const key in ctxCaller[property]) {
//     ctx[property][key] = ctxCaller[property][key];
//   }
// }

// function _delegateProperty(ctx, ctxCaller, property) {
//   const keyMock = `__executeBean__mock__${property}__`;
//   const keyOriginal = `__executeBean__mock__${property}__original__`;
//   if (['headers'].includes(property)) {
//     ctx[keyOriginal] = ctx[property];
//   }
//   Object.defineProperty(ctx, property, {
//     get() {
//       const value = ctxCaller && ctxCaller[property];
//       if (value) return value;
//       //
//       if (['headers'].includes(property)) {
//         return ctx[keyOriginal];
//       }
//       //
//       if (!ctx[keyMock]) {
//         ctx[keyMock] = {};
//       }
//       return ctx[keyMock];
//     },
//   });
// }
