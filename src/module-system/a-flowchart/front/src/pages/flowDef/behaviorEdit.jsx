import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;

// schema behavior
const __schemaBehavior = {
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
    color: {
      type: 'string',
      ebType: 'colorPicker',
      ebTitle: 'Color',
      notEmpty: true,
    },
  },
};

export default {
  mixins: [ebPageContext, ebPageDirty],
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      nodeId: this.$f7route.query.nodeId,
      behaviorId: this.$f7route.query.behaviorId,
      data: null,
      ready: false,
    };
  },
  computed: {
    context() {
      return this.contextParams.context;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    value() {
      return this.contextParams.value;
    },
    diagram() {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // diagram
      return container.diagram;
    },
    page_title() {
      const title = this.$text('Behavior');
      return this.page_getDirtyTitle(title);
    },
  },
  created() {
    this.__load();
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    async __load() {
      // data
      this.__initData();
      // schema
      await this.__initSchema();
      // ready
      this.ready = true;
    },
    __initData() {
      // type
      const type = this.value.type;
      // default base
      const defaultBase = this.$meta.util.extend({}, this.$config.schema.default.base.behavior);
      // base
      const base = this.diagram.behaviorBases[type];
      // default
      const optionsDefault = base.options.default;
      if (optionsDefault) {
        defaultBase.options = optionsDefault;
      }
      // data
      this.data = this.$meta.util.extend({}, defaultBase, this.value);
      // watch
      this._unwatch = this.$watch(
        'data',
        () => {
          this.page_setDirty(true);
        },
        { deep: true }
      );
    },
    async __initSchema() {
      // behaviorBase
      const base = this.diagram.behaviorBases[this.data.type];
      // schemaBase
      let schemaBase = __schemaBehavior;
      // schemaOptions
      let schemaOptions;
      if (base.validator) {
        const useStoreSchemas = await this.$store.use('a/validation/schemas');
        schemaOptions = await useStoreSchemas.getSchema({
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
    onPerformDone() {
      this.contextCallback(200, this.data);
      this.page_setDirty(false);
      this.$f7router.back();
    },
    _renderProperties() {
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
                // behaviorBase
                const behaviorBase = this.diagram.behaviorBases[type];
                return behaviorBase.titleLocale;
              },
            },
          },
        },
      };
      return (
        <eb-validate
          ref="validate"
          readOnly={this.readOnly}
          auto
          data={this.data}
          meta={meta}
          host={host}
        ></eb-validate>
      );
    },
  },
  render() {
    let domDone;
    if (!this.readOnly) {
      domDone = <eb-link iconF7="::done" propsOnPerform={this.onPerformDone}></eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>{domDone}</f7-nav-right>
        </eb-navbar>
        {this._renderProperties()}
      </eb-page>
    );
  },
};
