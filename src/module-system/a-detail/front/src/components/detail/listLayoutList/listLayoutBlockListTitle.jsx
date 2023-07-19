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
    return {};
  },
  methods: {
    layout_renderTitle() {
      return (
        <f7-list-item groupTitle>
          <div class="detail-list-title-container">
            {this.layout_renderTitleLeft()}
            {this.layout_renderTitleRight()}
          </div>
        </f7-list-item>
      );
    },
    layout_renderTitleLeft() {
      const title = this.layoutManager.container.params?.pageTitle;
      return <div class="actions-block actions-block-left">{title}</div>;
    },
    layout_renderTitleRight() {
      const children = this.layoutManager.bulk_renderActionsRight();
      return <div class="actions-block actions-block-right">{children}</div>;
    },
  },
  render() {
    return this.layout_renderTitle();
  },
};
