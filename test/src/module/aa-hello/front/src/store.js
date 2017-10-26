// eslint-disable-next-line
export default function(Vue) {

  return {
    state: {
      message: '',
    },
    getters: {
      message2: state => {
        return state.message + '!';
      },
    },
    mutations: {
      setMessage(state, message) {
        state.message = message;
      },
    },
    actions: {
      setMessage({ commit }, self) {
        return new Promise((resovle, reject) => {
          self.$api.get('home/index').then(data => {
            commit('setMessage', data);
            resovle();
          }).catch(err => {
            reject(err);
          });
        });
      },
    },
  };

}

