export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'enable') {
        return await this._enable({ ctx, action, item });
      } else if (action.name === 'disable') {
        return await this._disable({ ctx, action, item });
      }
    },
    async _enable({ ctx, action, item }) {

    },
    async _disable({ ctx, action, item }) {

    },
  },
};
