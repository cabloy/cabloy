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
    const domMineSubHeader = this.layoutManager.layout_renderBlock({
      blockName: 'mineSubHeader',
    });
    const domMineBody = this.layoutManager.layout_renderBlock({
      blockName: 'mineBody',
    });
    const domMineFooter = this.layoutManager.layout_renderBlock({
      blockName: 'mineFooter',
    });
    return (
      <div>
        {domMineHeader}
        {domMineSubHeader}
        {domMineBody}
        {domMineFooter}
      </div>
    );
  },
};
