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

export type TypeComposeNext = ((context?: any) => any) & {
  replay: (context?: any) => any;
};

export function compose(chains?: any[], adapter?: TypeComposeAdapter) {
  if (!adapter) adapter = __adapterDefault;
  if (!chains) chains = [];
  return function (context, next?) {
    return dispatch(0, context, { index: -1 });

    function dispatch(i, context, state: { index: number }) {
      if (i <= state.index) throw new Error('next() called multiple times');
      state.index = i;
      let receiver;
      let fn;
      const chain = chains![i];
      if (chain) {
        const obj = adapter!(context, chain);
        if (!obj) return dispatch(i + 1, context, state);
        receiver = obj.receiver;
        fn = obj.fn;
        if (!fn) throw new Error('fn is not defined');
      }
      if (i === chains!.length) fn = next;
      if (!fn) return context;
      const nextPatched = ((...args) => {
        const nextContext = args.length === 0 ? context : args[0];
        return dispatch(i + 1, nextContext, state);
      }) as TypeComposeNext;
      nextPatched.replay = (...args) => {
        const nextContext = args.length === 0 ? context : args[0];
        return dispatch(i + 1, nextContext, { index: i });
      };
      return fn.call(receiver, context, nextPatched);
    }
  };
}
