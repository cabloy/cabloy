export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  render() {
    const domMineHeader = this.layoutManager.layout_renderBlock({
      blockName: 'mineHeader',
    });
    const domMineBody = this.layoutManager.layout_renderBlock({
      blockName: 'mineBody',
    });
    return (
      <div>
        {domMineHeader}
        {domMineBody}
      </div>
    );
  },
};
