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
      ebType: 'text',
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
      behavior: null,
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
      let title = this.$text('Behavior');
      if (this.behavior) {
        title = `${title}: ${this.behavior.name}`;
      }
      return this.page_getDirtyTitle(title);
    },
  },
  watch: {
    behavior: {
      handler() {
        if (!this.ready) return;
        this.page_setDirty(true);
      },
      deep: true,
    },
  },
  created() {
    this.__load();
  },
  methods: {
    async __load() {
      // data
      this.behavior = this.$meta.util.extend({}, this.value);
      // schema
      await this.__initSchema();
      this.$nextTick(() => {
        this.ready = true;
      });
    },
    async __initSchema() {
      // behaviorBase
      const base = this.diagram.behaviorBases[this.behavior.type];
      // schemaBase
      let schemaBase = __schemaBehavior;
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
    onPerformDone() {
      this.contextCallback(200, this.behavior);
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
          data={this.behavior}
          meta={meta}
          host={host}
        ></eb-validate>
      );
    },
  },
  render() {
    let domDone;
    if (!this.readOnly) {
      domDone = <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>;
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
