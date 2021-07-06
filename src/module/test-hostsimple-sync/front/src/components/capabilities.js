export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action, item }) {
      if (action.name === 'shareLink') return this._shareLink({ ctx, action, item });
    },
    _shareLink({ item }) {
      console.log(item);
      if (item.success) {
        item.success();
      }
    },
  },
};
