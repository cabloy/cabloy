const __behaviorBaseId = 'behavior_0';
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
      await this.__initResources();
      await this.__prepareInstances();
      this.__registerNodes();
      this.__registerEdges();
      await this.__updateChart({});
      // emit
      this.$emit('contentEditDiagramInit');
    },
    async __initResources() {
      const promises = [];
      promises.push(this.$local.dispatch('getNodeBases').then(data => (this.nodeBases = data)));
      promises.push(this.$local.dispatch('getEdgeBases').then(data => (this.edgeBases = data)));
      promises.push(this.$local.dispatch('getBehaviorBases').then(data => (this.behaviorBases = data)));
      return await Promise.all(promises);
    },
    async __prepareInstances() {
      const promises = [];
      promises.push(this.__prepareInstance('a/antvx6/x6'));
      promises.push(this.__prepareInstance('a/antvlayout/layout'));
      const res = await Promise.all(promises);
      // ok
      this.x6 = res[0];
      this.xlayout = res[1];
    },
    async __prepareInstance(path) {
      const useStore = await this.$store.use(path);
      return useStore.getInstance();
    },
    async __updateChart({ changeSize, changeData }) {
      if (!this.ready) return;
      // graph
      if (!this.graph) {
        await this.__createChart();
      }
      // changeSize
      if (changeSize) {
        this.graph.resize(this.size.width, this.size.height);
        this.graph.centerContent();
      }
      // changeData
      if (changeData) {
        const model = await this.__createLayoutModel();
        this.graph.fromJSON(model);
        this.graph.centerContent();
      }
    },
    async __createChart() {
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
          allowMulti: context => {
            const { sourceCell, sourcePort, targetCell } = context;
            return !this.__checkEdgeExists(sourceCell.id, targetCell.id, sourcePort);
          },
          allowLoop: false,
          allowNode: true,
          allowEdge: false,
          allowPort: false,
          highlight: false,
          connector: 'smooth', // 'rounded',
          router: {
            name: 'normal', // 'orth', // 'manhattan'
          },
          createEdge: context => {
            const { sourceCell, sourceMagnet } = context;
            const behaviorId = sourceMagnet.getAttribute('data-id');
            const color = this.__getBehaviorColor(sourceCell.id, behaviorId);
            return new this.x6.Shape.Edge({
              attrs: {
                line: {
                  stroke: color,
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
      const model = await this.__createLayoutModel();
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
        const behaviorId = edge.getSource().port;
        this.addEdge(source.id, target.id, behaviorId);
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
    async __createLayoutModel() {
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
      const contentProcessRender = await this._combineContentProcessRender();
      return this.dagreLayout.layout(contentProcessRender);
    },
    async _combineContentProcessRender() {
      if (!this.contentProcess) return;
      // nodes
      const nodes = [];
      for (const item of this.contentProcess.nodes) {
        const node = await this.__createNode(item);
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
    async __getBehaviorIcon(item) {
      // behaviorBase
      const behaviorBase = this.behaviorBases[item.type];
      const color = item.color ? this.$meta.util.escapeURL(item.color) : '';
      const material = behaviorBase.icon.material;
      const f7 = behaviorBase.icon.f7;
      const url = behaviorBase.icon.url;
      // icon
      if (material || f7) {
        const icon = await this.$meta.util.combineIcon({ material, f7, color });
        return `<div class="eb-flowchart-node-icon">${icon}</div>`;
      }
      // url
      const iconUrl = this.$meta.util.combineFetchStaticPath(url);
      const iconSrc = this.$meta.util.escapeURL(iconUrl);
      return `<div class="eb-flowchart-node-icon">
                <img src="${iconSrc}" style="border: solid 1px ${color}" />
              </div>`;
    },
    async __createNodePorts(item) {
      // nodeBase
      const nodeBase = this.nodeBases[item.type];
      // items
      const items = [];
      // behavior base
      const material = nodeBase.icon.material;
      const f7 = nodeBase.icon.f7;
      const url = nodeBase.icon.url;
      let iconHtml;
      if (material || f7) {
        const icon = await this.$meta.util.combineIcon({ material, f7 });
        iconHtml = `<div class="eb-flowchart-node-icon">${icon}</div>`;
      } else {
        const iconUrl = this.$meta.util.combineFetchStaticPath(url);
        const iconSrc = this.$meta.util.escapeURL(iconUrl);
        iconHtml = `<div class="eb-flowchart-node-icon">
                      <img src="${iconSrc}" />
                    </div>`;
      }

      items.push({
        id: __behaviorBaseId,
        group: 'out',
        attrs: {
          icon: {
            html: iconHtml,
          },
        },
      });
      // behaviors
      const behaviors = item.behaviors;
      if (behaviors) {
        for (const behavior of behaviors) {
          const icon = await this.__getBehaviorIcon(behavior);
          items.push({
            id: behavior.id,
            group: 'out',
            attrs: {
              icon: {
                html: icon,
                'data-id': behavior.id,
              },
            },
          });
        }
      }
      // ok
      return {
        groups: {
          out: {
            markup: {
              tagName: 'foreignObject',
              selector: 'icon',
              attrs: {
                pointerEvents: 'visiblePainted',
                magnet: !this.readOnly,
              },
            },
            position: {
              name: 'top',
              args: {
                dx: -12,
                dy: 6,
              },
            },
          },
        },
        items,
      };
    },
    __getBehaviorColor(nodeId, behaviorId) {
      let color;
      if (!behaviorId) {
        color = '#000';
      } else {
        const behavior = this.__findBehavior(nodeId, behaviorId);
        color = behavior ? behavior.color : '';
      }
      return color;
    },
    async __createNode(item) {
      // label
      const labelText = this.$meta.util.escapeHtml(item.nameLocale || item.name);
      const label = `<div class="eb-flowchart-node-label">
                      <span>${labelText}</span>
                    </div>`;
      // ports
      const ports = await this.__createNodePorts(item);
      // node
      const node = {
        id: item.id,
        shape: 'eb-flowchart-node',
        attrs: {
          label: {
            html: label,
          },
        },
        ports,
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
      const source = { cell: item.source, port: item.behavior };
      const color = this.__getBehaviorColor(item.source, item.behavior);
      const edge = {
        id: item.id,
        shape: 'sequence',
        source,
        target: item.target,
        label: item.nameLocale || item.name,
        attrs: {
          line: {
            stroke: color,
            opacity: 0.6,
          },
        },
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
          label: {
            y: 24,
            refWidth: '100%',
          },
        },
      };
      return options;
    },
    async onSize(size) {
      this.size.height = size.height;
      this.size.width = size.width;
      await this.__updateChart({ changeSize: true });
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
    __findBehavior(nodeId, behaviorId) {
      const node = this.__findNode(nodeId);
      return node.behaviors.find(item => item.id === behaviorId);
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
    __checkEdgeExists(source, target, behaviorId) {
      if (behaviorId === __behaviorBaseId) behaviorId = null;
      return this.contentProcess.edges.some(item => {
        return source === item.source && target === item.target && (behaviorId || '') === (item.behavior || '');
      });
    },
    addEdge(source, target, behaviorId) {
      // check if exists
      if (this.__checkEdgeExists(source, target, behaviorId)) {
        // do nothing
        return;
      }
      // id
      const id = this.__getAvailableId(null);
      // edge
      const edge = { id, source, target };
      if (behaviorId && behaviorId !== __behaviorBaseId) {
        edge.behavior = behaviorId;
      }
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
    deleteEdges(ids) {
      // contentChange
      const value = this.$meta.util.extend({}, this.contentProcess);
      // delete edge: should not delete target node
      for (const id of ids) {
        const edgeIndex = value.edges.findIndex(item => item.id === id);
        if (edgeIndex > -1) {
          value.edges.splice(edgeIndex, 1);
        }
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
