import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomClasses ],
  props: {
    layoutManager: {
      type: Object,
    },
    filterConfig: {
      type: Object,
    },
  },
  data() {
    const form = this.$meta.util.getProperty(this.layoutManager, 'filter.form') || {
      atomName: null,
      star: (this.layoutManager.options && this.layoutManager.options.star) || 0,
      label: (this.layoutManager.options && this.layoutManager.options.label) || 0,
      stage: (this.layoutManager.options && this.layoutManager.options.stage) || 'archive',
      atomClass: null,
    };
    const formAtomClass = this.$meta.util.getProperty(this.layoutManager, 'filter.formAtomClass') || {};
    return {
      immediate: true,
      form,
      formAtomClass,
      validateParams: null,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('Filter');
    },
    userLabels() {
      const labelsAll = this.$store.getters['a/base/userLabels'];
      if (!labelsAll) return null;

      const labels = [{ title: '', value: 0 }];
      for (const key in labelsAll) {
        labels.push({ title: labelsAll[key].text, value: key });
      }
      return labels;
    },
    atomClass() {
      return this.form.atomClass || this.layoutManager.atomClass;
    },
    atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;
      const _atomClass = this.getAtomClass(this.atomClass);
      if (!_atomClass) return '';
      return _atomClass.titleLocale;
    },
    stages() {
      const stages = [];
      for (const key of [ 'draft', 'archive', 'history' ]) {
        stages.push({ title: key.replace(key[0], key[0].toUpperCase()), value: key });
      }
      return stages;
    },
  },
  watch: {
    form() {
      this.onFilterChanged();
    },
    formAtomClass() {
      this.onFilterChanged();
    },
  },
  created() {
    // labels
    this.$store.dispatch('a/base/getLabels');
    // init atomClass
    this.atomClassChanged();
  },
  mounted() {
    // immediate
    const $el = this.$$(this.$el);
    const $view = $el.parents('.eb-layout-view');
    this.immediate = $view.is('.eb-layout-panel-view');
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    atomClassChanged() {
      // reset
      this.validateParams = null;
      const atomClass = this.atomClass;
      if (!atomClass) return;
      // module
      this.$meta.module.use(atomClass.module, () => {
        // validateParams
        this.$api.post('/a/base/atomClass/validatorSearch', {
          atomClass: {
            module: atomClass.module,
            atomClassName: atomClass.atomClassName,
          },
        }).then(data => {
          this.validateParams = {
            module: data.module,
            validator: data.validator,
          };
        });
      });
    },
    onSelectAtomClass() {
      this.$view.navigate('/a/base/atom/selectAtomClass', {
        target: '_self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              if (this.form.atomClass !== data) {
                this.form.atomClass = data;
                this.formAtomClass = {};
                this.atomClassChanged();
              }
            }
          },
        },
      });
    },
    onFilterChanged(force) {
      if (force || this.immediate) {
        this.layoutManager.onFilterChanged({
          form: this.form, formAtomClass: this.formAtomClass,
        });
      }
    },
    onPerformSearch() {
      this.onFilterChanged(true);
      this.$f7router.back();
    },
    _renderNavbar() {
      return (
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            {!this.immediate && <eb-link ref="buttonSubmit" iconMaterial="search" propsOnPerform={this.onPerformSearch}></eb-link>}
          </f7-nav-right>
        </eb-navbar>
      );
    },
    _renderForm() {
      return (
        <eb-list form inline-labels no-hairlines-md onSubmit={this.onFormSubmit}>
          <eb-list-input v-model={this.form.atomName} label={this.$text('Atom Name')} type="text" clear-button placeholder={this.$text('Atom Name')}></eb-list-input>
          <f7-list-item title={this.$text('Star')}>
            <eb-toggle slot="after" v-model={this.form.star}></eb-toggle>
          </f7-list-item>
          <f7-list-item smartSelect title={this.$text('Label')} smartSelectParams={{ openIn: 'page', closeOnSelect: true }}>
            <eb-select name="label" v-model={this.form.label} options={this.userLabels}></eb-select>
          </f7-list-item>
          <f7-list-item smartSelect title={this.$text('Stage')} smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}>
            <eb-select name="stage" v-model={this.form.stage} options={this.stages}></eb-select>
          </f7-list-item>
          <f7-list-item divider></f7-list-item>
          {!this.layoutManager.atomClass && <f7-list-item title={this.$text('Atom Class')} link="#" onClick={this.onSelectAtomClass}>
            <div slot="after">{this.atomClassTitle}</div>
          </f7-list-item>}
        </eb-list>
      );
    },
    _renderFormAtomClass() {
      if (!this.validateParams) return null;
      return (
        <eb-validate ref="validate" auto data={this.formAtomClass} params={this.validateParams} onSubmit={this.onFormSubmit}>
        </eb-validate>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderNavbar()}
        {this._renderForm()}
        {this._renderFormAtomClass()}
      </div>
    );
  },
};
