export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    _renderActionsLeft() {
      const children = this.layoutManager.bulk_renderActionsLeft();
      return (
        <div class="actions-block actions-block-left">
          {children}
        </div>
      );
    },
    _renderActionsRight() {
      const children = this.layoutManager.bulk_renderActionsRight();
      return (
        <div class="actions-block actions-block-right">
          {children}
        </div>
      );
    },
  },
  render() {
    const title = this.layoutManager.container.title;
    return (
      <f7-list-item groupTitle title={title}>

      </f7-list-item>
    );
  },
};
