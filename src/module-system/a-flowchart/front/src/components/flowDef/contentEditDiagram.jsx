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
  computed: {
    contentProcessRender() {
      if (!this.contentProcess) return;
      const nodes = this.contentProcess.nodes.map(item => {
        const node = {
          id: item.id,
          label: item.nameLocale || item.name,
          width: 80,
          height: 40,
        };
        return node;
      });
      const edges = this.contentProcess.edges.map(item => {
        const edge = {
          id: item.id,
          source: item.source,
          target: item.target,
          label: item.nameLocale || item.name,
        };
        return edge;
      });
      return { nodes, edges };
    },
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
        this.__createChart();
      }
      if (changeSize) {
        this.graph.resize(this.size.width, this.size.height);
        this.graph.centerContent();
      }
      if (changeData) {
        const model = this.__createLayoutModel();
        this.graph.fromJSON(model);
        this.graph.centerContent();
      }
    },
    __createChart() {
      // graph
      this.graph = new this.x6.Graph({
        container: this.$refs.container.$el,
        width: this.size.width,
        height: this.size.height,
        scroller: {
          enabled: true,
          pannable: true,
          autoResize: true,
        },
        mousewheel: {
          enabled: true,
          modifiers: [ 'ctrl', 'meta' ],
        },
      });
      // model
      const model = this.__createLayoutModel();
      // render
      this.graph.fromJSON(model);
      this.graph.centerContent();
    },
    __createLayoutModel() {
      // layout
      const dagreLayout = new this.xlayout.DagreLayout({
        type: 'dagre',
        rankdir: this.size.width < this.size.height ? 'TB' : 'LR',
        align: undefined, // "UL",
        nodesep: 15,
        ranksep: 30,
        controlPoints: true,
      });
      return dagreLayout.layout(this.contentProcessRender);
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
