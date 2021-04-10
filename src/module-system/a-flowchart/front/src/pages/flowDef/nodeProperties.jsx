import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      flowDefId: this.$f7route.query.flowDefId,
      type: this.$f7route.query.type,
      id: this.$f7route.query.id,
      nodeBases: null,
      edgeBases: null,
      data: null,
      optionsValidator: null,
    };
  },
  computed: {
    ready() {
      return this.nodeBases && this.edgeBases && this.data;
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
    },
    __initData() {
      // data
      const data = this.type === 'node' ? this.diagram.__findNode(this.id) : this.diagram.__findEdge(this.id);
      // data meta
      const dataMeta = this.$meta.util.extend({}, this.type === 'node' ? this.$config.meta.node : this.$config.meta.edge);
      // base
      const base = this.type === 'node' ? this.nodeBases[data.type] : this.edgeBases.sequence;
      // default
      const optionsDefault = base.options.default;
      if (optionsDefault) {
        dataMeta.options = optionsDefault;
      }
      // options validator
      this.optionsValidator = base.validator;
      // data
      this.data = this.$meta.util.extend({}, dataMeta, data);
      // watch
      this._unwatch = this.$watch('data', () => {
        this.__dataChange();
      }, { deep: true });
    },
    onDiagramDestroy() {
      this.$view.close();
    },
    __getPageTitle() {
      if (!this.data) return this.$text('Properties');
      return `${this.$text('Properties')}: ${this.data.nameLocale || this.data.name || this.data.id}`;
    },
    __dataChange() {
      this.diagram.__dataChange(this.type, this.id, this.data);
    },
    renderBasic() {
      if (!this.ready) return;
      const children = [];
      // id
      children.push(
        <f7-list-item title='ID' key="id">
          <div slot="after">{this.data.id}</div>
        </f7-list-item>
      );
      // name
      if (this.readOnly) {
        children.push(
          <f7-list-item title={this.$text('Name')} key="name">
            <div slot="after">{this.data.nameLocale || this.data.name}</div>
          </f7-list-item>
        );
      } else {
        children.push(
          <eb-list-input key="name" type="text" clearButton value={this.data.name} onInput={value => { this.data.name = value; } }>
            <div slot="label">{this.$text('Name')}</div>
          </eb-list-input>
        );
      }
      // group options
      let groupOptions = null;
      if (this.optionsValidator) {
        groupOptions = (
          <f7-list-group>
            <f7-list-item group-title title={this.$text('Options')}></f7-list-item>
          </f7-list-group>
        );
      }
      // list
      return (
        <f7-list form inline-labels no-hairlines-md>
          <f7-list-group>
            <f7-list-item group-title title={this.$text('Basic')}></f7-list-item>
            {children}
          </f7-list-group>
          {groupOptions}
        </f7-list>
      );
    },
    renderOptions() {
      if (!this.ready) return;
      return (
        <eb-validate ref="validate" readOnly={this.readOnly} auto data={this.data.options} params={this.optionsValidator}>
        </eb-validate>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.__getPageTitle()} eb-back-link="Back">
        </eb-navbar>
        {this.renderBasic()}
        {this.renderOptions()}
      </eb-page>
    );
  },
};

