export default {
  meta: {
    global: false,
  },
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  methods: {
    onAction() {
      if (this.action.name === 'shareLink') return this._shareLink();
    },
    _shareLink() {
      const item = this.item;
      console.log(item);
      if (item.success) {
        item.success();
      }
    },
  },
};
