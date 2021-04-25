// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      capabilities: {},
    },
    getters: {
    },
    mutations: {
      register(state, capability) {
        const name = capability.name;
        state.capabilities[name] = capability;
      },
    },
    actions: {
    },
  };

}
