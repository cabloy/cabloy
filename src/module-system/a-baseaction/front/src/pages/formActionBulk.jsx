import Vue from 'vue';
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageDirty],
  data() {
    const query = this.$f7route.query;
    const module = query.module;
    const atomClassName = query.atomClassName;
    const atomClass = module && atomClassName ? { module, atomClassName } : null;
    const formAction = query.formAction;
    const schema = JSON.stringify(query.schema);
    const title = query.title;
    return {
      atomClass,
      formAction,
      schema,
      title,
      formItem: {},
    };
  },
  computed: {
    page_title() {
      return this.page_getDirtyTitle(this.title);
    },
  },
  created() {},
  methods: {
    async onPerformSave() {
      // 为什么不直接调用后端api
      return await this.$refs.validate.perform();
    },
    onFormSubmit() {
      this.$refs.buttonSave.onClick();
    },
    onValidateItemChange() {
      this.page_setDirty(true);
    },
    async onPerformValidate() {
      await this.$api.post('store/saveInfo', {
        data: this.formItem,
      });
      this.page_setDirty(false);
      return true; // toast on success
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::save" ref="buttonSave" propsOnPerform={this.onPerformSave}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        {this.formItem && (
          <eb-validate
            ref="validate"
            auto={true}
            data={this.formItem}
            params={this.validateParams}
            propsOnPerform={this.onPerformValidate}
            onSubmit={this.onFormSubmit}
            onValidateItemChange={this.onValidateItemChange}
          ></eb-validate>
        )}
      </eb-page>
    );
  },
};
