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
      tagsAll: null,
    };
  },
  computed: {
    form() {
      return this.layoutManager.filter.data.form;
    },
  },
  created() {},
  mounted() {
    this._unwatchPageTitle = this.$watch(
      'layoutManager.page_title',
      () => {
        this._changePageTitle();
      },
      {
        immediate: true,
      }
    );
  },
  beforeDestroy() {
    if (this._unwatchPageTitle) {
      this._unwatchPageTitle();
      this._unwatchPageTitle = null;
    }
  },
  methods: {
    _changePageTitle() {
      const title = this.layoutManager.page_title;
      this.$page.setPageTitle(title);
    },
    onClickStage() {
      this.layoutManager.filter_openTab('general');
    },
    onClickCategory() {
      this.layoutManager.filter_openTab('category');
    },
    onClickTag() {
      this.layoutManager.filter_openTab('tag');
    },
    getStage() {
      let stage = this.layoutManager.base_getCurrentStage();
      if (!stage || stage === 'formal') return null;
      stage = this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
      return stage;
    },
    getCategoryName() {
      this._fixCategoriesTagsAll();
      return this._getCategoryName(this.form.category);
    },
    getTagName() {
      this._fixCategoriesTagsAll();
      return this._getTagName(this.form.tag);
    },
    _fixCategoriesTagsAll() {
      const key1 = this._getKey(this.atomClass, this.language);
      const key2 = this._getKey(this.form.atomClass, this.form.language);
      if (key1 === key2) return true;
      // reset
      this.atomClass = this.form.atomClass;
      this.language = this.form.language;
      this.categoriesAll = null;
      this.tagsAll = null;
      // load
      this._loadCategoriesAll();
      this._loadTagsAll();
      return false;
    },
    async _loadCategoriesAll() {
      if (!this.atomClass) return;
      this.categoriesAll = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.atomClass,
        language: this.language,
      });
    },
    async _loadTagsAll() {
      if (!this.atomClass) return;
      this.tagsAll = await this.$store.dispatch('a/base/getTags', {
        atomClass: this.atomClass,
        language: this.language,
      });
    },
    _getCategoryName(categoryId) {
      if (!this.categoriesAll || !categoryId) return '';
      const category = this.categoriesAll.find(_item => _item.id === categoryId);
      return category ? category.categoryNameLocale || category.categoryName : '';
    },
    _getTagName(tagId) {
      if (!this.tagsAll || !tagId) return '';
      const tag = this.tagsAll.find(_item => _item.id === tagId);
      return tag ? tag.tagName : '';
    },
    _getKey(atomClass, language) {
      if (!atomClass) return null;
      return `${atomClass.module}:${atomClass.atomClassName}:${language || ''}`;
    },
    _renderAtomMain() {
      const atomMain = this.layoutManager.base_atomMain;
      if (!atomMain) return null;
      const atomName = atomMain.atomNameLocale || atomMain.atomName || atomMain._meta?.atomName;
      if (!atomName) return null;
      return <f7-badge>{atomName}</f7-badge>;
    },
    _renderStage() {
      // stage
      const stage = this.getStage();
      if (!stage) return null;
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
        <f7-badge color="teal" class="eb-cursor-pointer" nativeOnClick={this.onClickCategory}>
          {categoryName}
        </f7-badge>
      );
    },
    _renderTag() {
      if (!this.layoutManager.base.ready) return;
      const tagName = this.getTagName();
      if (!tagName) return null;
      return (
        <f7-badge color="blue" class="eb-cursor-pointer" nativeOnClick={this.onClickTag}>
          {tagName}
        </f7-badge>
      );
    },
  },
  render() {
    return (
      <f7-nav-title>
        <div>{this.layoutManager.page_title}</div>
        <div class="subtitle">
          {this._renderAtomMain()}
          {this._renderStage()}
          {this._renderCategory()}
          {this._renderTag()}
        </div>
      </f7-nav-title>
    );
  },
};
