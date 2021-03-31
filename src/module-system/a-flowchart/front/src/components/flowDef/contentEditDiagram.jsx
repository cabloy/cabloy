export default {
  meta: {
    global: false,
  },
  props: {
    readOnly: {
      type: Boolean,
    },
    contentProcess: {
      type: Object,
    },
  },
  data() {
    return {
      g6: null,
      graph: null,
      size: {
        height: 0,
        width: 0,
      },
    };
  },
  created() {
  },
  mounted() {
    this.__init();
  },
  methods: {
    __init() {
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
        });
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
        this.graph.refresh();
      }
    },
    __adjustNode() {
      this.graph.node(node => {
        return {
          id: node.id,
          type: 'rect',
          label: node.name,
          style: {
            fill: 'blue',
          },
        };
      });
    },
    __adjustEdge() {
      this.graph.edge(edge => {
        return {
          id: edge.id,
          type: 'cubic-horizontal',
          style: {
            stroke: 'green',
          },
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
      <eb-box ref="container" onSize={this.onSize} header subnavbar class="eb-iframe-box">
      </eb-box>
    );
  },
};
