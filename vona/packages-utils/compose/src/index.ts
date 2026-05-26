export type TypeComposeAdapter = (
  context: any,
  chain: any,
) => { receiver?: any; fn?: Function } | undefined;

function __adapterDefault(_context, chain) {
  return {
    receiver: undefined,
    fn: chain,
  };
}

export function compose(chains?: any[], adapter?: TypeComposeAdapter) {
  if (!adapter) adapter = __adapterDefault;
  if (!chains) chains = [];
  return function (context, next?) {
    // last called middleware #
    let index = -1;
    return dispatch(0, context);
    function dispatch(i, context) {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      let receiver;
      let fn;
      const chain = chains![i];
      if (chain) {
        const obj = adapter!(context, chain);
        if (!obj) return dispatch(i + 1, context);
        receiver = obj.receiver;
        fn = obj.fn;
        if (!fn) throw new Error('fn is not defined');
      }
      if (i === chains!.length) fn = next;
      if (!fn) return context;
      return fn.call(receiver, context, (...args) => {
        context = args.length === 0 ? context : args[0];
        return dispatch(i + 1, context);
      });
    }
  };
}
