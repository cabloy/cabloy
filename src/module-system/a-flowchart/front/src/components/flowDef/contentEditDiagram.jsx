export default {
  meta: {
    global: false,
  },
  props: {
    readOnly: {
      type: Boolean,
    },
    contentProcessStr: {
      type: String,
    },
    tabActive: {
      type: Boolean,
    },
  },
  data() {
    return {
      contentProcess: null,
      x6: null,
      xlayout: null,
      graph: null,
      size: {
        height: 0,
        width: 0,
      },
      dirty: false,
    };
  },
  watch: {
    contentProcessStr() {
      this.contentProcess = JSON5.parse(this.contentProcessStr);
      if (this.tabActive) {
        this.__updateChart({ changeData: true });
      } else {
        this.dirty = true;
      }
    },
    tabActive() {
      if (this.tabActive && this.dirty) {
        this.dirty = false;
        this.__updateChart({ changeData: true });
      }
    },
  },
  created() {
  },
  mounted() {
    this.__init();
  },
  methods: {
    async __init() {
      this.contentProcess = JSON5.parse(this.contentProcessStr);
      await this.__prepareInstances();
      this.__updateChart({});
    },
    async __prepareInstances() {
      const promises = [];
      let action = {
        actionModule: 'a-antvx6',
        actionComponent: 'x6',
        name: 'instance',
      };
      promises.push(this.__prepareInstance({ action }));
      action = {
        actionModule: 'a-antvlayout',
        actionComponent: 'layout',
        name: 'instance',
      };
      promises.push(this.__prepareInstance({ action }));
      const res = await Promise.all(promises);
      // ok
      this.x6 = res[0];
      this.xlayout = res[1];
    },
    async __prepareInstance({ action }) {
      return await this.$meta.util.performAction({ ctx: this, action });
    },
    __updateChart({ changeSize, changeData }) {
      if (!this.x6 || !this.xlayout) return;
      if (!this.graph) {
        this.graph = new this.g6.Graph({
          container: this.$refs.container.$el,
          width: this.size.width,
          height: this.size.height,
          fitView: true,
          fitViewPadding: 10,
          layout: {
            type: 'dagre',
            // rankdir: this.size.width < this.size.height ? 'TB' : 'LR',
            rankdir: 'TB', // always top->bottom
            // align: undefined, // center
            nodesep: 20,
            ranksep: 30,
            controlPoints: true,
          },
          modes: {
            default: [ 'drag-canvas', 'zoom-canvas' ],
            edit: [
              'drag-canvas', 'zoom-canvas', 'click-select',
              {
                type: 'create-edge',
                trigger: 'drag',
              },
            ],
          },
        });
        this.graph.setMode(this.readOnly ? 'default' : 'edit');
        this.__adjustNode();
        this.__adjustEdge();
        this.graph.data(this.contentProcess);
        this.graph.render();
      }
      if (changeSize) {
        this.graph.changeSize(this.size.width, this.size.height);
        this.graph.fitView();
      }
      if (changeData) {
        this.graph.changeData(this.contentProcess);
        this.graph.render();
        // this.graph.refresh();
      }
    },
    __adjustNode() {
      this.graph.node(node => {
        return {
          id: node.id,
          type: 'rect',
          label: node.name,
        };
      });
    },
    __adjustEdge() {
      this.graph.edge(edge => {
        return {
          id: edge.id,
          type: 'cubic-horizontal',
        };
      });
    },
    onSize(size) {
      this.size.height = size.height;
      this.size.width = size.width;
      this.__updateChart({ changeSize: true });
    },
  },
  render() {
    return (
      <eb-box ref="container" onSize={this.onSize} header subnavbar class="eb-box-iframe">
      </eb-box>
    );
  },
};
