// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      hosts: {},
      capabilities: {},
    },
    getters: {
    },
    mutations: {
      registerHost(state, host) {
        const name = host.name;
        state.hosts[name] = host;
      },
      registerCapability(state, capability) {
        const name = capability.name;
        state.capabilities[name] = capability;
      },
    },
    actions: {
    },
  };

}
