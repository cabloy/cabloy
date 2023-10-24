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
    const schema = query.schema ? JSON.parse(query.schema) : null;
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
    async onPerformDone() {
      // performValidate
      await this.$refs.validate.perform();
      this.page_setDirty(false);
    },
    onFormSubmit() {
      this.$refs.buttonDone.onClick();
    },
    onValidateItemChange() {
      this.page_setDirty(true);
    },
    async onPerformValidate() {
      return await this.$api.post('validation/validate', {
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
