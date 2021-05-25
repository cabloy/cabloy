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
      mine: (this.layoutManager.container.options && this.layoutManager.container.options.mine) || 0,
      stage: (this.layoutManager.container.options && this.layoutManager.container.options.stage) || 'formal',
      language: (this.layoutManager.container.options && this.layoutManager.container.options.language) || '',
      category: (this.layoutManager.container.options && this.layoutManager.container.options.category) || 0,
      tag: (this.layoutManager.container.options && this.layoutManager.container.options.tag) || 0,
      star: (this.layoutManager.container.options && this.layoutManager.container.options.star) || 0,
      label: (this.layoutManager.container.options && this.layoutManager.container.options.label) || 0,
      atomClass: this.layoutManager.container.atomClass,
    };
    const formAtomClass = this.$meta.util.getProperty(this.layoutManager, 'filter.data.formAtomClass') || {};
    return {
      form,
      formAtomClass,
      validateParams: null,
      categoriesAll: null,
      tagsAll: null,
      ready: false,
      schemaSearch: null,
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
      return this.form.atomClass;
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
      for (const key of [ 'draft', 'formal', 'history' ]) {
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
  },
  methods: {
    onAtomClassesReady() {
      this.init();
    },
    async init() {
      // labels
      await this.$store.dispatch('a/base/getLabels');
      // locales
      await this.$store.dispatch('a/base/getLocales');
      // init atomClass
      await this.atomClassChanged();
      //
      this.ready = true;
    },
    async loadCategoriesAll(language) {
      const atomClassBase = this.atomClassBase;
      if (!atomClassBase || !atomClassBase.category) return;
      this.categoriesAll = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.atomClass,
        language,
      });
    },
    async loadTagsAll(language) {
      const atomClassBase = this.atomClassBase;
      if (!atomClassBase || !atomClassBase.tag) return;
      this.tagsAll = await this.$store.dispatch('a/base/getTags', {
        atomClass: this.atomClass,
        language,
      });
    },
    async atomClassChanged() {
      // reset
      this.validateParams = null;
      const atomClass = this.atomClass;
      if (!atomClass) return;
      // categories
      await this.loadCategoriesAll(this.form.language);
      // tags
      await this.loadTagsAll(this.form.language);
      // module
      await this.$meta.module.use(atomClass.module);
      // validateParams
      const data = await this.$api.post('/a/base/atomClass/validatorSearch', {
        atomClass: {
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
        },
      });
      this.validateParams = {
        module: data.module,
        validator: data.validator,
      };
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
        form: this.form,
        formAtomClass: this.formAtomClass,
        schemaSearch: this.schemaSearch,
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
    onSchemaReady(schema) {
      this.schemaSearch = schema;
    },
    getCategoryName(categoryId) {
      if (!this.categoriesAll || !categoryId) return '';
      const category = this.categoriesAll.find(_item => _item.id === categoryId);
      return category ? (category.categoryNameLocale || category.categoryName) : '';
    },
    getTagName(tagId) {
      if (!this.tagsAll || !tagId) return '';
      const tag = this.tagsAll.find(_item => _item.id === tagId);
      return tag ? tag.tagName : '';
    },
    combineAtomClassAndLanguage(language) {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (language) {
        queries.language = language;
      }
      return queries;
    },
    async _selectLanguage(event) {
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
        targetEl: event.target,
      };
      let language;
      if (this.form.language) {
        language = this.form.language;
      } else {
        const locale = await this.$meta.util.performAction({ ctx: this, action, item: this.atomClass });
        if (locale) {
          language = locale.value;
          this.form.language = locale.value;
        }
      }
      return language;
    },
    async onChooseCategory(event) {
      const language = await this._selectLanguage(event);
      if (language) {
        await this.loadCategoriesAll(language);
      }
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.combineAtomClassAndLanguage(language));
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              categoryIdStart: 0,
              leafOnly: true,
            },
            callback: (code, node) => {
              if (code === 200) {
                this.form.category = node ? node.id : 0;
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
    async onChooseTag(event) {
      const language = await this._selectLanguage(event);
      if (language) {
        await this.loadTagsAll(language);
      }
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries('/a/basefront/tag/select', this.combineAtomClassAndLanguage(language));
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              tags: this.form.tag ? [ this.form.tag ] : null,
              multiple: false,
            },
            callback: (code, tag) => {
              if (code === 200) {
                this.form.tag = tag;
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
    _renderForm() {
      return (
        <eb-list form inline-labels no-hairlines-md onSubmit={this.onFormSubmit}>
          <eb-list-input v-model={this.form.atomName} label={this.$text('Atom Name')} type="text" clear-button placeholder={this.$text('Atom Name')}></eb-list-input>
          <f7-list-item title={this.$text('Mine')}>
            <eb-toggle slot="after" v-model={this.form.mine}></eb-toggle>
          </f7-list-item>
          <f7-list-item smartSelect title={this.$text('Stage')} smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}>
            <eb-select name="stage" v-model={this.form.stage} options={this.stages}></eb-select>
          </f7-list-item>
          <f7-list-item divider></f7-list-item>
          {this._renderLanguageAndOthers()}
          <f7-list-item title={this.$text('UserStar')}>
            <eb-toggle slot="after" v-model={this.form.star}></eb-toggle>
          </f7-list-item>
          <f7-list-item smartSelect title={this.$text('UserLabel')} smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}>
            <eb-select name="label" v-model={this.form.label} options={this.userLabels}></eb-select>
          </f7-list-item>
          <f7-list-item divider></f7-list-item>
          {this._renderAtomClass()}
        </eb-list>
      );
    },
    _renderLanguage() {
      return (
        <f7-list-item key="form.language" smartSelect title={this.$text('Language')} smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}>
          <eb-select name="language" v-model={this.form.language} options={this.locales}></eb-select>
        </f7-list-item>
      );
    },
    _renderCategory() {
      return (
        <eb-list-item-choose key="form.category"
          link="#" title={this.$text('Category')} propsOnChoose={this.onChooseCategory}>
          <div slot="after">{this.getCategoryName(this.form.category)}</div>
        </eb-list-item-choose>
      );
    },
    _renderTag() {
      return (
        <eb-list-item-choose key="form.tag"
          link="#" title={this.$text('Tag')} propsOnChoose={this.onChooseTag}>
          <div slot="after">{this.getTagName(this.form.tag)}</div>
        </eb-list-item-choose>
      );
    },
    _renderLanguageAndOthers() {
      const atomClassBase = this.atomClassBase;
      if (!atomClassBase) return null;
      const children = [];
      // language
      if (atomClassBase.language) {
        children.push(this._renderLanguage());
      }
      // category
      if (atomClassBase.category) {
        children.push(this._renderCategory());
      }
      // tag
      if (atomClassBase.tag) {
        children.push(this._renderTag());
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
        <eb-validate ref="validate" auto data={this.formAtomClass} params={this.validateParams} onSubmit={this.onFormSubmit} onSchemaReady={this.onSchemaReady}>
        </eb-validate>
      );
    },
  },
  render() {
    return (
      <div>
        {this.ready && this._renderForm()}
        {this.ready && this._renderFormAtomClass()}
      </div>
    );
  },
};
