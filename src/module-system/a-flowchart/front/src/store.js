// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      nodeBases: null,
      edgeBases: null,
    },
    getters: {
    },
    mutations: {
      setNodeBases(state, nodeBases) {
        state.nodeBases = nodeBases;
      },
      setEdgeBases(state, edgeBases) {
        state.edgeBases = edgeBases;
      },
    },
    actions: {
      getNodeBases({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.nodeBases) return resolve(state.nodeBases);
          Vue.prototype.$meta.api.post('/a/flow/flowDef/nodeBases').then(data => {
            data = data || {};
            commit('setNodeBases', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
      getEdgeBases({ state, commit }) {
        return new Promise((resolve, reject) => {
          if (state.edgeBases) return resolve(state.edgeBases);
          Vue.prototype.$meta.api.post('/a/flow/flowDef/edgeBases').then(data => {
            data = data || {};
            commit('setEdgeBases', data);
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },
    },
  };

}
