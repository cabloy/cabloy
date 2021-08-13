export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      atomClass: null,
      language: null,
      categoriesAll: null,
    };
  },
  computed: {
    form() {
      return this.layoutManager.filter.data.form;
    },
  },
  created() {},
  methods: {
    onClickStage() {
      this.layoutManager.filter_openTab('basic');
    },
    onClickCategory() {
      this.layoutManager.filter_openTab('category');
    },
    getStage() {
      let stage = this.layoutManager.base_getCurrentStage();
      if (!stage) stage = 'formal';
      stage = this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
      return stage;
    },
    getCategoryName() {
      // fix categoriesAll
      this._fixCategoriesAll();
      return this._getCategoryName(this.form.category);
    },
    _fixCategoriesAll() {
      const key1 = this._getKey(this.atomClass, this.language);
      const key2 = this._getKey(this.form.atomClass, this.form.language);
      if (key1 === key2) return true;
      // reset
      this.atomClass = this.form.atomClass;
      this.language = this.form.language;
      this.categoriesAll = null;
      // load
      this._loadCategoriesAll();
      return false;
    },
    async _loadCategoriesAll() {
      if (!this.atomClass) return;
      this.categoriesAll = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.atomClass,
        language: this.language,
      });
    },
    _getCategoryName(categoryId) {
      if (!this.categoriesAll || !categoryId) return '';
      const category = this.categoriesAll.find(_item => _item.id === categoryId);
      return category ? category.categoryNameLocale || category.categoryName : '';
    },
    _getKey(atomClass, language) {
      if (!atomClass) return null;
      return `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
    },
    _renderStage() {
      // stage
      const stage = this.getStage();
      // render
      return (
        <f7-badge class="eb-cursor-pointer" nativeOnClick={this.onClickStage}>
          {stage}
        </f7-badge>
      );
    },
    _renderCategory() {
      if (!this.layoutManager.base.ready) return;
      const categoryName = this.getCategoryName();
      if (!categoryName) return null;
      return (
        <f7-badge class="eb-cursor-pointer" nativeOnClick={this.onClickCategory}>
          {categoryName}
        </f7-badge>
      );
    },
  },
  render() {
    return (
      <f7-nav-title>
        <div>{this.layoutManager.page_getTitle()}</div>
        <div class="subtitle">
          {this._renderStage()}
          {this._renderCategory()}
        </div>
      </f7-nav-title>
    );
  },
};
