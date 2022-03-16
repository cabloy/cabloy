import Vue from 'vue';
const ebClipboard = Vue.prototype.$meta.module.get('a-components').options.mixins.ebClipboard;
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  meta: {
    global: false,
  },
  mixins: [ebClipboard, ebPageContext, ebPageDirty],
  data() {
    return {
      sceneName: this.$f7route.query.sceneName,
      schema: null,
      data: null,
    };
  },
  computed: {
    ready() {
      return !!this.schema && !!this.data;
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
      await this._prepareScheme();
      this._prepareData();
    },
    onFormSubmit() {
      this.$refs.buttonSave.onClick();
    },
    onPerformSave(event) {
      return this.$refs.validate.perform(event);
    },
    onValidateItemChange() {
      this.page_setDirty(true);
    },
    async onPerformValidate() {
      await this.$api.post('kitchen-sink/form-schema-validation/saveValidation', {
        data: this.item,
      });
      this.page_setDirty(false);
      return true; // toast on success
    },
    async _prepareScheme() {
      const meta = this.item.meta;
      // schema
      const schema = await this.$api.post('/a/validation/validation/schema', {
        module: meta.validator.module,
        validator: meta.validator.validator,
        schema: null,
      });
      // combine schema
      this._combineSchema(schema);
      this.schema = schema;
    },
    _prepareData() {
      const data = {
        ...this.item.scenes[this.sceneName],
      };
      this._combineAuthenticateUrls(data);
      this.data = data;
    },
    _combineAuthenticateUrls(data) {
      const meta = this.item.meta;
      if (meta.mode !== 'redirect') return;
      const urlParamScene = meta.scene ? `/${this.sceneName}` : '';
      const urls = {
        loginURL: `/api/a/auth/passport/${this.item.module}/${this.item.providerName}${urlParamScene}`,
        callbackURL: `/api/a/auth/passport/${this.item.module}/${this.item.providerName}${urlParamScene}/callback`,
      };
      data.__groupUrlInfo = urls;
    },
    _combineSchema(schema) {
      const meta = this.item.meta;
      if (meta.mode !== 'redirect') return;
      schema.schema.properties = {
        ...schema.schema.properties,
        __groupUrlInfo: {
          ebType: 'group',
          ebTitle: 'URL Info',
          properties: {
            loginURL: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'Login URL',
              ebReadOnly: true,
            },
            callbackURL: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'Callback URL',
              ebReadOnly: true,
            },
          },
        },
      };
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
      if (!this.ready) return;
      return (
        <eb-validate
          ref="validate"
          auto
          data={this.data}
          meta={{ schema: this.schema }}
          propsOnPerform={this.onPerformValidate}
          onSubmit={this.onFormSubmit}
          onValidateItemChange={this.onValidateItemChange}
        ></eb-validate>
      );
    },
  },
  render() {
    let domSave;
    if (this.ready) {
      domSave = <eb-link ref="buttonSave" iconF7="::save" propsOnPerform={this.onPerformSave}></eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Config')} eb-back-link="Back">
          <f7-nav-right>{domSave}</f7-nav-right>
        </eb-navbar>
        {this._renderValidate()}
      </eb-page>
    );
  },
};
