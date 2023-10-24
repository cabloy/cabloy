import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageContext, ebPageDirty],
  data() {
    const query = this.$f7route.query;
    const module = query.module;
    const atomClassName = query.atomClassName;
    const atomClass = module && atomClassName ? { module, atomClassName } : null;
    const formAction = query.formAction;
    return {
      atomClass,
      formAction,
      formItem: {},
    };
  },
  computed: {
    page_title() {
      return this.page_getDirtyTitle(this.title);
    },
    schema() {
      return this.contextParams.schema;
    },
    title() {
      return this.contextParams.title;
    },
    layoutManager() {
      return this.contextParams.layoutManager;
    },
  },
  created() {},
  methods: {
    async onPerformDone() {
      // performValidate
      const res = await this.$refs.validate.perform();
      const item = res.data;
      // form action
      const formAction = this.formAction;
      // data options
      const dataOptionsContinue = { formActionContinue: true };
      // action
      const useStoreAtomActions = await this.$store.use('a/basestore/atomActions');
      let actionBase = await useStoreAtomActions.getActionBase({ atomClass: this.atomClass, name: formAction });
      actionBase = this.$utils.extend({}, actionBase, { dataOptions: dataOptionsContinue });
      // close this page
      this.page_setDirty(false);
      this.$f7router.back();
      // not await
      this.$meta.util.performAction({ ctx: this.layoutManager, action: actionBase, item });
    },
    onFormSubmit() {
      this.$refs.buttonDone.onClick();
    },
    onValidateItemChange() {
      this.page_setDirty(true);
    },
    async onPerformValidate() {
      return await this.$api.post('/a/validation/validation/validate', {
        params: this.schema,
        data: this.formItem,
      });
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::done" ref="buttonDone" propsOnPerform={this.onPerformDone}>
              {this.$text('Submit')}
            </eb-link>
          </f7-nav-right>
        </eb-navbar>
        <eb-validate
          ref="validate"
          auto={true}
          data={this.formItem}
          params={this.schema}
          propsOnPerform={this.onPerformValidate}
          onSubmit={this.onFormSubmit}
          onValidateItemChange={this.onValidateItemChange}
        ></eb-validate>
      </eb-page>
    );
  },
};
