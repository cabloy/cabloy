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
    filterContainer: {
      type: Object,
    },
  },
  data() {
    const form = this.$meta.util.getProperty(this.layoutManager, 'filter.data.form') || {
      atomName: null,
      stage: (this.layoutManager.container.options && this.layoutManager.container.options.stage) || 'archive',
      language: (this.layoutManager.container.options && this.layoutManager.container.options.language) || '',
      category: (this.layoutManager.container.options && this.layoutManager.container.options.category) || 0,
      tag: (this.layoutManager.container.options && this.layoutManager.container.options.tag) || 0,
      star: (this.layoutManager.container.options && this.layoutManager.container.options.star) || 0,
      label: (this.layoutManager.container.options && this.layoutManager.container.options.label) || 0,
      atomClass: null,
    };
    const formAtomClass = this.$meta.util.getProperty(this.layoutManager, 'filter.data.formAtomClass') || {};
    return {
      form,
      formAtomClass,
      validateParams: null,
    };
  },
  computed: {
    userLabels() {
      const labelsAll = this.$store.getters['a/base/userLabels'];
      if (!labelsAll) return null;

      const labels = [{ title: '', value: 0 }];
      for (const key in labelsAll) {
        labels.push({ title: labelsAll[key].text, value: key });
      }
      return labels;
    },
    locales() {
      const locales = this.$store.getState('a/base/locales');
      if (!locales) return [];
      return [{ title: '', value: '' }].concat(locales);
    },
    atomClass() {
      return this.form.atomClass || this.layoutManager.container.atomClass;
    },
    atomClassBase() {
      if (!this.atomClass) return null;
      return this.getAtomClass(this.atomClass);
    },
    atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;
      const _atomClass = this.atomClassBase;
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
    form: {
      handler() {
        this.onFilterChanged();
      },
      deep: true,
    },
    formAtomClass: {
      handler() {
        this.onFilterChanged();
      },
      deep: true,
    },
  },
  created() {
    // labels
    this.$store.dispatch('a/base/getLabels');
    // locales
    this.$store.dispatch('a/base/getLocales');
    // init atomClass
    this.atomClassChanged();
  },
  methods: {
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
      this.$view.navigate('/a/basefront/atom/selectAtomClass', {
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
      if (force || this.filterContainer.immediate) {
        this.onFilterDebounce();
      }
    },
    onFilterDebounce: Vue.prototype.$meta.util.debounce(function() {
      this.layoutManager.filter_onChanged({
        form: this.form, formAtomClass: this.formAtomClass,
      });
    }, 300),
    onPerformSearch() {
      this.onFilterChanged(true);
      this.$f7router.back();
    },
    onFormSubmit() {
      if (this.filterContainer.immediate) {
        // donothing
      } else {
        this.onPerformSearch();
      }
    },
    _renderForm() {
      return (
        <eb-list form inline-labels no-hairlines-md onSubmit={this.onFormSubmit}>
          <eb-list-input v-model={this.form.atomName} label={this.$text('Atom Name')} type="text" clear-button placeholder={this.$text('Atom Name')}></eb-list-input>
          <f7-list-item smartSelect title={this.$text('Stage')} smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}>
            <eb-select name="stage" v-model={this.form.stage} options={this.stages}></eb-select>
          </f7-list-item>
          <f7-list-item divider></f7-list-item>
          {this._renderLanguageAndOthers()}
          <f7-list-item title={this.$text('UserStar')}>
            <eb-toggle slot="after" v-model={this.form.star}></eb-toggle>
          </f7-list-item>
          <f7-list-item smartSelect title={this.$text('UserLabel')} smartSelectParams={{ openIn: 'page', closeOnSelect: true }}>
            <eb-select name="label" v-model={this.form.label} options={this.userLabels}></eb-select>
          </f7-list-item>
          <f7-list-item divider></f7-list-item>
          {this._renderAtomClass()}
        </eb-list>
      );
    },
    _renderLanguageAndOthers() {
      const atomClassBase = this.atomClassBase;
      if (!atomClassBase) return null;
      const children = [];
      // language
      if (!atomClassBase.language) {
        children.push(
          <f7-list-item key="form.language" smartSelect title={this.$text('Language')} smartSelectParams={{ openIn: 'page', closeOnSelect: true }}>
            <eb-select name="language" v-model={this.form.language} options={this.locales}></eb-select>
          </f7-list-item>
        );
      }
      // divider
      if (children.length > 0) {
        children.push(
          <f7-list-item divider></f7-list-item>
        );
      }
      // ok
      return children;
    },
    _renderAtomClass() {
      if (this.layoutManager.container.atomClass) return null;
      return (
        <f7-list-item title={this.$text('Atom Class')} link="#" onClick={this.onSelectAtomClass}>
          <div slot="after">{this.atomClassTitle}</div>
        </f7-list-item>
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
        {this._renderForm()}
        {this._renderFormAtomClass()}
      </div>
    );
  },
};
