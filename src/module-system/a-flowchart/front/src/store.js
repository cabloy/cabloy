// eslint-disable-next-line
export default function (Vue) {
  return {
    state: {
      behaviorBases: null,
      nodeBases: null,
      edgeBases: null,
      flowServiceBases: null,
    },
    getters: {},
    mutations: {
      setBehaviorBases(state, behaviorBases) {
        state.behaviorBases = behaviorBases;
      },
      setNodeBases(state, nodeBases) {
        state.nodeBases = nodeBases;
      },
      setEdgeBases(state, edgeBases) {
        state.edgeBases = edgeBases;
      },
      setFlowServiceBases(state, flowServiceBases) {
        state.flowServiceBases = flowServiceBases;
      },
    },
    actions: {
      getBehaviorBases({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.behaviorBases) return resolve(state.behaviorBases);
          Vue.prototype.$meta.api
            .post('/a/flow/flowDef/behaviorBases')
            .then(data => {
              data = data || {};
              commit('setBehaviorBases', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getNodeBases({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.nodeBases) return resolve(state.nodeBases);
          Vue.prototype.$meta.api
            .post('/a/flow/flowDef/nodeBases')
            .then(data => {
              data = data || {};
              commit('setNodeBases', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getEdgeBases({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.edgeBases) return resolve(state.edgeBases);
          Vue.prototype.$meta.api
            .post('/a/flow/flowDef/edgeBases')
            .then(data => {
              data = data || {};
              commit('setEdgeBases', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      getFlowServiceBases({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.flowServiceBases) return resolve(state.flowServiceBases);
          Vue.prototype.$meta.api
            .post('/a/flow/flowDef/flowServiceBases')
            .then(data => {
              data = data || {};
              commit('setFlowServiceBases', data);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
    },
  };
}
