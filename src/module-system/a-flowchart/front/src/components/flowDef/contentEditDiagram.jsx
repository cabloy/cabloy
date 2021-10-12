export default {
  meta: {
    global: false,
  },
  props: {
    viewOnly: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
    },
    contentProcessStr: {
      type: String,
    },
    tabActive: {
      type: Boolean,
    },
    flowDefId: {
      type: Number,
    },
    flowNodeDefIds: {
      type: Array,
    },
  },
  data() {
    return {
      contentProcess: null,
      nodeBases: null,
      edgeBases: null,
      behaviorBases: null,
      x6: null,
      xlayout: null,
      graph: null,
      dagreLayout: null,
      size: {
        height: 0,
        width: 0,
      },
      dirty: false,
    };
  },
  computed: {
    ready() {
      return this.x6 && this.xlayout && this.nodeBases && this.edgeBases && this.behaviorBases;
    },
    contentProcessRender() {
      if (!this.contentProcess) return;
      // nodes
      const nodes = [];
      for (const item of this.contentProcess.nodes) {
        const node = this.__createNode(item);
        nodes.push(node);
      }
      // edges
      const edges = [];
      for (const item of this.contentProcess.edges) {
        const edge = this.__createEdge(item);
        edges.push(edge);
      }
      return { nodes, edges };
    },
  },
  watch: {
    contentProcessStr() {
      this.contentProcess = window.JSON5.parse(this.contentProcessStr);
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
  created() {},
  mounted() {
    this.__init();
    // if (!this.readOnly && !this.$device.desktop) {
    //   this.$nextTick(() => {
    //     this.$view.toast.show({ text: this.$text('EditInPCTip') });
    //   });
    // }
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.dispose();
      this.graph = null;
    }
    if (this.dagreLayout) {
      this.dagreLayout.destroy();
      this.dagreLayout = null;
    }
    this.$emit('diagram:destroy');
  },
  methods: {
    async __init() {
      this.contentProcess = window.JSON5.parse(this.contentProcessStr);
      this.nodeBases = await this.$local.dispatch('getNodeBases');
      this.edgeBases = await this.$local.dispatch('getEdgeBases');
      this.behaviorBases = await this.$local.dispatch('getBehaviorBases');
      await this.__prepareInstances();
      this.__registerNodes();
      this.__registerEdges();
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
      if (!this.ready) return;
      // graph
      if (!this.graph) {
        this.__createChart();
      }
      // changeSize
      if (changeSize) {
        this.graph.resize(this.size.width, this.size.height);
        this.graph.centerContent();
      }
      // changeData
      if (changeData) {
        const model = this.__createLayoutModel();
        this.graph.fromJSON(model);
        this.graph.centerContent();
      }
    },
    __createChart() {
      // container
      const container = this.$refs.container;
      // graph
      this.graph = new this.x6.Graph({
        container,
        grid: {
          size: 10,
          visible: true,
        },
        width: this.size.width,
        height: this.size.height,
        background: {
          color: '#FFFFFF',
        },
        selecting: {
          enabled: !this.readOnly,
          multiple: false,
          rubberband: false,
          showNodeSelectionBox: true,
          showEdgeSelectionBox: true,
        },
        scroller: {
          enabled: true,
          pannable: true,
          autoResize: true,
        },
        mousewheel: {
          enabled: true,
          modifiers: ['ctrl', 'meta'],
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowMulti: false,
          allowLoop: false,
          allowNode: true,
          allowEdge: false,
          allowPort: false,
          highlight: false,
          connector: 'smooth', // 'rounded',
          router: {
            name: 'normal', // 'orth', // 'manhattan'
          },
          createEdge: () => {
            return new this.x6.Shape.Edge({
              attrs: {
                line: {
                  stroke: '#000',
                  opacity: 0.4,
                },
              },
            });
          },
        },
        interacting() {
          if (this.readOnly) return false;
          return {
            nodeMovable: true,
            magnetConnectable: true,
            edgeMovable: true,
            edgeLabelMovable: false,
            arrowheadMovable: true,
            vertexMovable: false,
            vertexAddable: false,
            vertexDeletable: false,
          };
        },
      });
      // events
      this.__graphEvents(container);
      // model
      const model = this.__createLayoutModel();
      // render
      this.graph.fromJSON(model);
      this.graph.centerContent();
    },
    __graphEvents(/* container*/) {
      if (this.viewOnly) return;
      // connected
      this.graph.on('edge:connected', ({ isNew, edge }) => {
        if (!isNew) return;
        const source = edge.getSourceCell();
        const target = edge.getTargetCell();
        this.addEdge(source.id, target.id);
      });
      // node:click
      this.graph.on('node:click', ({ node }) => {
        window.setTimeout(() => {
          this.showProperties({ node });
        }, 300);
      });
      // edge:click
      this.graph.on('edge:click', ({ edge }) => {
        window.setTimeout(() => {
          this.showProperties({ edge });
        }, 300);
      });
    },
    __createLayoutModel() {
      // layout
      if (!this.dagreLayout) {
        const directionHorizontal = this.size.width > this.size.height;
        this.dagreLayout = new this.xlayout.DagreLayout({
          type: 'dagre',
          rankdir: directionHorizontal ? 'LR' : 'TB',
          align: undefined, // "UL",
          nodesep: directionHorizontal ? 30 : 50,
          ranksep: directionHorizontal ? 70 : 50,
          controlPoints: true,
        });
      }
      return this.dagreLayout.layout(this.contentProcessRender);
    },
    __createNode(item) {
      // nodeBase
      const nodeBase = this.nodeBases[item.type];
      // icons
      const icon = this.$meta.util.combineFetchStaticPath(nodeBase.icon);
      const iconSrc = this.$meta.util.escapeURL(icon);
      const icons = `<div class="eb-flowchart-node-icons">
                      <img src="${iconSrc}" />
                    </div>`;
      // label
      const labelText = this.$meta.util.escapeHtml(item.nameLocale || item.name);
      const label = `<div class="eb-flowchart-node-label">
                      <span>${labelText}</span>
                    </div>`;
      // node
      const node = {
        id: item.id,
        shape: 'eb-flowchart-node',
        attrs: {
          icons: {
            html: icons,
          },
          label: {
            html: label,
          },
        },
      };
      // highlight current node
      if (this.flowNodeDefIds && this.flowNodeDefIds.indexOf(item.id) > -1) {
        node.attrs.body = {
          stroke: 'orange',
          strokeWidth: 4,
        };
      }
      return node;
    },
    __createEdge(item) {
      const edge = {
        id: item.id,
        shape: 'sequence',
        source: item.source,
        target: item.target,
        label: item.nameLocale || item.name,
      };
      return edge;
    },
    __registerEdges() {
      // always register for readOnly maybe changed
      // if (this.x6.Graph.__registerEdges) return;
      // this.x6.Graph.__registerEdges = true;
      for (const edgeType in this.edgeBases) {
        const edgeBase = this.edgeBases[edgeType];
        const options = this.__registerEdge(edgeBase);
        this.x6.Graph.registerEdge(edgeType, options, true);
      }
    },
    __registerNodes() {
      // always register for readOnly maybe changed
      // if (this.x6.Graph.__registerNodes) return;
      // this.x6.Graph.__registerNodes = true;
      const options = this.__registerNode();
      this.x6.Graph.registerNode('eb-flowchart-node', options, true);
    },
    __registerEdge(/* edgeBase*/) {
      const options = {
        inherit: 'edge',
        attrs: {
          line: {
            stroke: '#333333',
          },
        },
      };
      return options;
    },
    __registerNode() {
      const options = {
        width: 120,
        height: 80,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'foreignObject',
            selector: 'icons',
          },
          {
            tagName: 'foreignObject',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 1,
            rx: 6,
            ry: 6,
            refWidth: '100%',
            refHeight: '100%',
            pointerEvents: 'visiblePainted',
          },
          icons: {
            refWidth: '100%',
            height: 32,
            pointerEvents: 'visiblePainted',
            magnet: !this.readOnly,
          },
          label: {
            y: 24,
            refWidth: '100%',
          },
        },
      };
      return options;
    },
    onSize(size) {
      this.size.height = size.height;
      this.size.width = size.width;
      this.__updateChart({ changeSize: true });
    },
    onPerformAddNode() {
      if (!this.ready) return;
      this.$view.navigate(`/a/flowchart/flowDef/nodes?flowDefId=${this.flowDefId}`, {
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'flowChart', title: 'Flow Chart' },
        context: {
          params: {
            diagram: this,
          },
        },
      });
    },
    __findNode(id) {
      return this.contentProcess.nodes.find(item => item.id === id);
    },
    __findEdge(id) {
      return this.contentProcess.edges.find(item => item.id === id);
    },
    showProperties({ node, edge }) {
      // queries
      const queries = {
        flowDefId: this.flowDefId,
        type: node ? 'node' : 'edge',
        id: node ? node.id : edge.id,
      };
      // url
      const url = this.$meta.util.combineQueries('/a/flowchart/flowDef/nodeProperties', queries);
      // navigate
      this.$view.navigate(url, {
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'properties', title: 'Properties' },
        context: {
          params: {
            diagram: this,
          },
        },
      });
    },
    addEdge(source, target) {
      // id
      const id = this.__getAvailableId(null);
      // edge
      const edge = { id, source, target };
      // contentChange
      const value = this.$meta.util.extend({}, this.contentProcess);
      value.edges.push(edge);
      this.$emit('contentChange', { type: 'process', value });
    },
    addNode(nodeBase) {
      // id
      const id = this.__getAvailableId(nodeBase);
      // name
      const name = nodeBase.titleLocale || nodeBase.title;
      // node
      const node = {
        id,
        name,
        type: nodeBase.type,
      };
      // contentChange
      const value = this.$meta.util.extend({}, this.contentProcess);
      value.nodes.push(node);
      this.$emit('contentChange', { type: 'process', value });
    },
    deleteNode(id) {
      // contentChange
      const value = this.$meta.util.extend({}, this.contentProcess);
      // delete in/out edge
      const edgesIn = value.edges.filter(item => item.target === id);
      const edgesOut = value.edges.filter(item => item.source === id);
      const edges = edgesIn.concat(edgesOut);
      for (const edge of edges) {
        const edgeIndex = value.edges.findIndex(item => item.id === edge.id);
        if (edgeIndex > -1) {
          value.edges.splice(edgeIndex, 1);
        }
      }
      // delete node
      const nodeIndex = value.nodes.findIndex(item => item.id === id);
      if (nodeIndex > -1) {
        value.nodes.splice(nodeIndex, 1);
      }
      // emit
      this.$emit('contentChange', { type: 'process', value });
    },
    deleteEdge(id) {
      // contentChange
      const value = this.$meta.util.extend({}, this.contentProcess);
      // delete edge: should not delete target node
      const edgeIndex = value.edges.findIndex(item => item.id === id);
      if (edgeIndex > -1) {
        value.edges.splice(edgeIndex, 1);
      }
      // emit
      this.$emit('contentChange', { type: 'process', value });
    },
    __dataChange(type, id, data) {
      const value = this.$meta.util.extend({}, this.contentProcess);
      if (type === 'node') {
        const index = value.nodes.findIndex(item => item.id === id);
        value.nodes.splice(index, 1, data);
      } else {
        const index = value.edges.findIndex(item => item.id === id);
        value.edges.splice(index, 1, data);
      }
      this.$emit('contentChange', { type: 'process', value });
    },
    __getAvailableId(nodeBase) {
      let id = 0;
      const cells = nodeBase ? this.contentProcess.nodes : this.contentProcess.edges;
      for (const cell of cells) {
        if (!cell.id) continue;
        const _id = parseInt(cell.id.split('_')[1] || 0);
        if (_id > id) {
          id = _id;
        }
      }
      return nodeBase ? `${nodeBase.type}_${id + 1}` : `edge_${id + 1}`;
    },
  },
  render() {
    return (
      <div>
        <eb-box ref="box" onSize={this.onSize} header subnavbar={!this.viewOnly} class="eb-box-iframe">
          <div ref="container"></div>
        </eb-box>
      </div>
    );
  },
};
