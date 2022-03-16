import Vue from 'vue';
const ebClipboard = Vue.prototype.$meta.module.get('a-components').options.mixins.ebClipboard;
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  meta: {
    global: false,
  },
  mixins: [ebClipboard, ebPageContext],
  data() {
    return {
      sceneName: this.$f7route.query.sceneName,
      schema: null,
    };
  },
  computed: {
    ready() {
      return !!this.schema;
    },
    item() {
      return this.contextParams.item;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const meta = this.item.meta;
      // schema
      const schema = await this.$api.post('/a/validation/validation/schema', {
        module: meta.validator.module,
        validator: meta.validator.validator,
        schema: null,
      });
      console.log(schema);
    },
    clipboardCreate() {
      if (!this.meta) return;
      this.$nextTick(() => {
        for (const btn of ['loginURL', 'callbackURL']) {
          this.addClipboardTrigger(this.$refs[btn].$el, {
            text: (/* trigger*/) => {
              return this.meta[btn];
            },
          });
        }
      });
    },
    _renderValidate() {
      return (
        <eb-validate
          ref="validate"
          auto
          data={this.base.item}
          params={this.base.validateParams}
          propsOnPerform={this.validate_onPerformValidate}
          onSubmit={this.validate_onSubmit}
        ></eb-validate>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Config')} eb-back-link="Back"></eb-navbar>
        {this._renderValidate()}
      </eb-page>
    );
  },
};
