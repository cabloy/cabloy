// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      message: 'Hello World',
    },
    getters: {
      message2(state) {
        return state.message + '!';
      },
    },
    mutations: {
      setMessage(state, message) {
        state.message = message;
      },
    },
    actions: {
      getMessage({ state, commit }) {
        return new Promise((resolve, reject) => {
          const data = 'test for dispatch';
          commit('setMessage', data);
          resolve(data);
        });
      },
    },
  };

}
