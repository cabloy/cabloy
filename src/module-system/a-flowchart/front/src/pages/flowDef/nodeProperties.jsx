import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

// schema node
const __schemaNode = {
  type: 'object',
  properties: {
    __groupBasic: {
      ebType: 'group-flatten',
      ebTitle: 'Basic',
    },
    id: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'ID',
      ebReadOnly: true,
    },
    name: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Name',
      notEmpty: true,
    },
    type: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Type',
      ebReadOnly: true,
    },
  },
};

// schema edge
const __schemaEdge = {
  type: 'object',
  properties: {
    __groupBasic: {
      ebType: 'group-flatten',
      ebTitle: 'Basic',
    },
    id: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'ID',
      ebReadOnly: true,
    },
    name: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Name',
      notEmpty: true,
    },
    source: {
      type: 'string',
      ebType: 'component',
      ebTitle: 'Source',
      ebRender: {
        module: 'a-flowchart',
        name: 'renderSelectNode',
      },
      notEmpty: true,
    },
    target: {
      type: 'string',
      ebType: 'component',
      ebTitle: 'Target',
      ebRender: {
        module: 'a-flowchart',
        name: 'renderSelectNode',
      },
      notEmpty: true,
    },
  },
};

export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      type: this.$f7route.query.type, // node/edge
      id: this.$f7route.query.id,
      nodeBases: null,
      edgeBases: null,
      data: null,
      schema: null,
    };
  },
  computed: {
    ready() {
      return this.nodeBases && this.edgeBases && this.data && this.schema;
    },
    diagram() {
      return this.contextParams.diagram;
    },
    readOnly() {
      return this.diagram.readOnly;
    },
  },
  created() {
    this.__load();
  },
  mounted() {
    this.diagram.$on('diagram:destroy', this.onDiagramDestroy);
  },
  beforeDestroy() {
    this.diagram.$off('diagram:destroy', this.onDiagramDestroy);
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    async __load() {
      // nodeBases/edgeBases
      this.nodeBases = await this.$local.dispatch('getNodeBases');
      this.edgeBases = await this.$local.dispatch('getEdgeBases');
      // data
      this.__initData();
      // schema
      await this.__initSchema();
    },
    __initData() {
      // data
      const data = this.type === 'node' ? this.diagram.__findNode(this.id) : this.diagram.__findEdge(this.id);
      // default base
      const defaultBase = this.$meta.util.extend({}, this.type === 'node' ? this.$config.schema.default.base.node : this.$config.schema.default.base.edge);
      // base
      const base = this.type === 'node' ? this.nodeBases[data.type] : this.edgeBases.sequence;
      // default
      const optionsDefault = base.options.default;
      if (optionsDefault) {
        defaultBase.options = optionsDefault;
      }
      // data
      this.data = this.$meta.util.extend({}, defaultBase, data);
      // watch
      this._unwatch = this.$watch('data', () => {
        this.__dataChange();
      }, { deep: true });
    },
    async __initSchema() {
      // base
      const base = this.type === 'node' ? this.nodeBases[this.data.type] : this.edgeBases.sequence;
      // schemaBase
      let schemaBase = this.type === 'node' ? __schemaNode : __schemaEdge;
      // schemaOptions
      let schemaOptions;
      if (base.validator) {
        schemaOptions = await this.$api.post('/a/validation/validation/schema', {
          module: base.validator.module,
          validator: base.validator.validator,
          schema: null,
        });
      }
      // combine
      if (schemaOptions) {
        const schemaGroupOptions = {
          type: 'object',
          properties: {
            options: {
              type: 'object',
              ebType: 'group',
              ebTitle: 'Options',
              properties: schemaOptions.schema.properties,
            },
          },
        };
        schemaBase = this.$meta.util.extend({}, schemaBase, schemaGroupOptions);
      }
      // ok
      this.schema = {
        module: base.validator ? base.validator.module : 'a-flowchart',
        validator: base.validator ? base.validator.validator : null,
        schema: schemaBase,
      };
    },
    onDiagramDestroy() {
      this.$view.close();
    },
    async onPerformDelete() {
      await this.$view.dialog.confirm();
      if (this.type === 'node') {
        this.diagram.deleteNode(this.id);
      } else {
        this.diagram.deleteEdge(this.id);
      }
      this.$view.close();
    },
    __getPageTitle() {
      if (!this.data) return this.$text('Properties');
      return `${this.$text('Properties')}: ${this.data.nameLocale || this.data.name || this.data.id}`;
    },
    __dataChange() {
      this.diagram.__dataChange(this.type, this.id, this.data);
    },
    __getHost() {
      const host = {
        flowDefId: this.flowDefId,
        diagram: this.diagram,
      };
      return host;
    },
    renderList() {
      if (!this.ready) return;
      const host = {
        container: this,
      };
      const meta = {
        schema: this.schema,
        properties: {
          type: {
            ebPatch: {
              getValue: type => {
                // base
                const base = this.type === 'node' ? this.nodeBases[type] : this.edgeBases.sequence;
                return base.titleLocale;
              },
            },
          },
        },
      };
      return (
        <eb-validate ref="validate" readOnly={this.readOnly} auto data={this.data} meta={meta} host={host}>
        </eb-validate>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.__getPageTitle()} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconMaterial="delete" propsOnPerform={this.onPerformDelete}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        {this.renderList()}
      </eb-page>
    );
  },
};

