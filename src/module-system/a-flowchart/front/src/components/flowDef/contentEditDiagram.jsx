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
      g6: null,
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
    __init() {
      this.contentProcess = JSON5.parse(this.contentProcessStr);
      const action = {
        actionModule: 'a-antvg6',
        actionComponent: 'g6',
        name: 'instance',
      };
      this.$meta.util.performAction({ ctx: this, action }).then(g6 => {
        this.g6 = g6;
        this.__updateChart({});
      });
    },
    __updateChart({ changeSize, changeData }) {
      if (!this.g6) return;
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
