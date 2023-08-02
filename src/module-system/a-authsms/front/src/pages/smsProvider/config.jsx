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
      providerName: this.$f7route.query.providerName,
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
    onSaveProvider() {
      return this.contextParams.onSaveProvider;
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
      await this._prepareSchema();
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
      await this.onSaveProvider(this.data);
      this.page_setDirty(false);
      this.contextCallback(200, null);
      this.$f7router.back();
      return true; // toast on success
    },
    async _prepareSchema() {
      // schema
      const schema = await this.$api.post('/a/validation/validation/schema', {
        module: 'a-authsms',
        validator: this.providerName,
        schema: null,
      });
      this.schema = schema;
    },
    _prepareData() {
      this.data = this.item;
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
