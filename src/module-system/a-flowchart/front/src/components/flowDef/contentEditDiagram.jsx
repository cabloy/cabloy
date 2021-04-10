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
    flowDef: {
      type: Object,
    },
  },
  data() {
    return {
      contentProcess: null,
      nodeBases: null,
      edgeBases: null,
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
      return this.x6 && this.xlayout && this.nodeBases && this.edgeBases;
    },
    contentProcessRender() {
      if (!this.contentProcess) return;
      const nodes = this.contentProcess.nodes.map(item => {
        const node = {
          id: item.id,
          shape: item.type,
          attrs: {
            label: {
              text: item.nameLocale || item.name,
            },
          },
        };
        return node;
      });
      const edges = this.contentProcess.edges.map(item => {
        const edge = {
          id: item.id,
          shape: 'sequence',
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
    if (!this.readOnly && !this.$device.desktop) {
      this.$nextTick(() => {
        this.$view.toast.show({ text: this.$text('EditInPCTip') });
      });
    }
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
      this.contentProcess = JSON5.parse(this.contentProcessStr);
      this.nodeBases = await this.$local.dispatch('getNodeBases');
      this.edgeBases = await this.$local.dispatch('getEdgeBases');
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
      const container = this.$refs.container.$el;
      // graph
      this.graph = new this.x6.Graph({
        container,
        width: this.size.width,
        height: this.size.height,
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
          modifiers: [ 'ctrl', 'meta' ],
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
          // connector: 'jumpover',
          router: {
            name: 'manhattan', // 'orth',
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
    __graphEvents(container) {
      // mouseenter
      this.graph.on('node:mouseenter', () => {
        const ports = container.querySelectorAll(
          '.x6-port-body'
        );
        this.__showPorts(ports, true);
      });
      // mouseleave
      this.graph.on('node:mouseleave', () => {
        const ports = container.querySelectorAll(
          '.x6-port-body'
        );
        this.__showPorts(ports, false);
      });
      // connected
      this.graph.on('edge:connected', ({ isNew, edge }) => {
        if (!isNew) return;
        const source = edge.getSourceCell();
        const target = edge.getTargetCell();
        this.addEdge(source.id, target.id);
      });
      // node:click
      this.graph.on('node:click', ({ node }) => {
        this.showProperties({ node });
      });
      // edge:click
      this.graph.on('edge:click', ({ edge }) => {
        this.showProperties({ edge });
      });
    },
    __createLayoutModel() {
      // layout
      if (!this.dagreLayout) {
        this.dagreLayout = new this.xlayout.DagreLayout({
          type: 'dagre',
          rankdir: this.size.width < this.size.height ? 'TB' : 'LR',
          align: undefined, // "UL",
          nodesep: 30,
          ranksep: 60,
          controlPoints: true,
        });
      }
      return this.dagreLayout.layout(this.contentProcessRender);
    },
    __registerEdges() {
      if (this.x6.Graph.__registerEdges) return;
      this.x6.Graph.__registerEdges = true;
      for (const edgeType in this.edgeBases) {
        const edgeBase = this.edgeBases[edgeType];
        const options = this.__registerEdge(edgeBase);
        this.x6.Graph.registerEdge(edgeType, options);
      }
    },
    __registerNodes() {
      if (this.x6.Graph.__registerNodes) return;
      this.x6.Graph.__registerNodes = true;
      for (const nodeType in this.nodeBases) {
        const nodeBase = this.nodeBases[nodeType];
        let options;
        if (nodeBase.group === 'startEvent' || nodeBase.group === 'endEvent') {
          options = this.__registerNodeCircle(nodeBase);
        } else {
          options = this.__registerNodeRect(nodeBase);
        }
        this.x6.Graph.registerNode(nodeType, options);
      }
    },
    __registerEdge(edgeBase) {
      const options = {
        inherit: 'edge',
        attrs: {
          line: {
            stroke: '#000',
            opacity: 0.4,
          },
        },
      };
      return options;
    },
    __registerNodeCircle(nodeBase) {
      const options = {
        width: 80,
        height: 80,
        ports: this.__registerConnectionPorts(),
        markup: [
          {
            tagName: 'circle',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'image',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            fill: '#ffffff',
            stroke: '#000',
            strokeWidth: 0,
            r: 40,
            refX: '50%',
            refY: '50%',
            pointerEvents: 'visiblePainted',
          },
          image: {
            refWidth: '100%',
            refHeight: '100%',
            opacity: 0.4,
            pointerEvents: 'none',
            href: this.$meta.util.combineFetchStaticPath(nodeBase.icon),
          },
          label: {
            fontSize: 14,
            fill: '#333333',
            refX: '50%',
            refY: '50%',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          },
        },
      };
      return options;
    },
    __registerNodeRect(nodeBase) {
      const options = {
        width: 125,
        height: 100,
        ports: this.__registerConnectionPorts(),
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
            selector: 'image',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            fill: '#ffffff',
            stroke: '#000',
            strokeWidth: 0,
            refWidth: '100%',
            refHeight: '100%',
            pointerEvents: 'visiblePainted',
          },
          image: {
            refWidth: '100%',
            refHeight: '100%',
            opacity: 0.4,
            pointerEvents: 'none',
            href: this.$meta.util.combineFetchStaticPath(nodeBase.icon),
          },
          label: {
            fontSize: 14,
            fill: '#333333',
            refX: '50%',
            refY: '75%',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle',
          },
        },
      };
      return options;
    },
    __registerConnectionPorts() {
      return {
        groups: {
          group1: {
            position: {
              name: 'absolute',
              args: { x: '50%', y: '50%' },
            },
            attrs: {
              circle: {
                r: 8,
                magnet: true,
                stroke: 'orange',
                strokeWidth: 2,
                fill: 'transparent',
                style: {
                  visibility: 'hidden',
                },
              },
            },
          },
        },
        items: [
          {
            group: 'group1',
          },
        ],
      };
    },
    __showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
      }
    },
    onSize(size) {
      this.size.height = size.height;
      this.size.width = size.width;
      this.__updateChart({ changeSize: true });
    },
    onPerformPlus() {
      this.$view.navigate(`/a/flowchart/flowDef/nodes?flowDefId=${this.flowDef.atomId}`, {
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
        flowDefId: this.flowDef.atomId,
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
      // node
      const node = {
        id,
        name: nodeBase.type,
        type: nodeBase.type,
      };
      // contentChange
      const value = this.$meta.util.extend({}, this.contentProcess);
      value.nodes.push(node);
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
    renderActions() {
      if (this.readOnly) return null;
      const children = [];
      // add
      children.push(
        <eb-link key="diagram-action-plus" class="diagram-action-plus" iconMaterial="add_circle" propsOnPerform={event => this.onPerformPlus(event)}></eb-link>
      );
      return (
        <div class="diagram-actions">
          {children}
        </div>
      );
    },
  },
  render() {
    let domActions;
    if (this.ready) {
      domActions = this.renderActions();
    }
    return (
      <div>
        <eb-box ref="container" onSize={this.onSize} header subnavbar class="eb-box-iframe">
        </eb-box>
        {domActions}
      </div>
    );
  },
};
