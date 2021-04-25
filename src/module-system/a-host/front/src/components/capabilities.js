export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action, item }) {
      if (action.name === 'register') return this._register({ item });
    },
    _register({ item }) {
      this.$local.commit('register', item);
    },
  },
};
