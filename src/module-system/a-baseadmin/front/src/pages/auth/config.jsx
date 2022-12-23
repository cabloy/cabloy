import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  meta: {
    global: false,
  },
  mixins: [ebPageContext, ebPageDirty],
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
    title() {
      return this.contextParams.title;
    },
    onSaveScene() {
      return this.contextParams.onSaveScene;
    },
    page_title() {
      return this.page_getDirtyTitle(this.title);
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
      await this.onSaveScene(this.data);
      this.page_setDirty(false);
      this.contextCallback(200, null);
      this.$f7router.back();
      return true; // toast on success
    },
    async _prepareScheme() {
      const metaScene = this._getMetaScene();
      // schema
      const schema = await this.$api.post('/a/validation/validation/schema', {
        module: metaScene.validator.module,
        validator: metaScene.validator.validator,
        schema: null,
      });
      // combine schema
      this._combineSchema(schema);
      this.schema = schema;
    },
    _prepareData() {
      const data = this.$meta.util.extend({}, this.item.scenes[this.sceneName]);
      this._combineAuthenticateUrls(data);
      this.data = data;
    },
    _getMetaScene() {
      const meta = this.item.meta;
      if (meta.scene) {
        const scene = this.item.metaScenes && this.item.metaScenes[this.sceneName];
        return (scene && scene.meta) || meta;
      }
      return meta;
    },
    _combineAuthenticateUrls(data) {
      const meta = this.item.meta;
      const metaScene = this._getMetaScene();
      if (metaScene.mode !== 'redirect') return;
      const urlParamScene = meta.scene ? `/${this.sceneName}` : '';
      const urls = {
        loginURL: `//api/a/auth/passport/${this.item.module}/${this.item.providerName}${urlParamScene}`,
        callbackURL: `//api/a/auth/passport/${this.item.module}/${this.item.providerName}${urlParamScene}/callback`,
      };
      urls.loginURL = this.$meta.util.combineFetchPath(null, urls.loginURL);
      urls.callbackURL = this.$meta.util.combineFetchPath(null, urls.callbackURL);
      data.__groupUrlInfo = urls;
    },
    _combineSchema(schema) {
      const metaScene = this._getMetaScene();
      if (metaScene.mode !== 'redirect') return;
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
              ebParams: {
                textarea: true,
              },
              ebReadOnly: true,
            },
            callbackURL: {
              type: 'string',
              ebType: 'text',
              ebTitle: 'Callback URL',
              ebParams: {
                textarea: true,
              },
              ebReadOnly: true,
            },
          },
        },
      };
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
      domSave = <eb-link ref="buttonSave" iconF7="::done" propsOnPerform={this.onPerformSave}></eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.page_title} eb-back-link="Back">
          <f7-nav-right>{domSave}</f7-nav-right>
        </eb-navbar>
        {this._renderValidate()}
      </eb-page>
    );
  },
};
