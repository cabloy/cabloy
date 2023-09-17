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
    item() {
      return this.layoutManager.base.item;
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
    openUrl(options) {
      const atomClass = this.layoutManager.base.atomClass;
      // queries
      const queries = {
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        options: JSON.stringify(options),
      };
      const url = this.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      this.$view.navigate(url, {
        target: '_group',
      });
    },
    onClickStage() {
      // options
      const options = {
        stage: this.layoutManager.base_getCurrentStage(),
      };
      this.openUrl(options);
    },
    onClickCategory() {
      // options
      const options = {
        language: this.item.atomLanguage,
        category: this.item.atomCategoryId,
      };
      this.openUrl(options);
    },
    onClickTag(tagId) {
      // options
      const options = {
        language: this.item.atomLanguage,
        tag: tagId,
      };
      this.openUrl(options);
    },
    getStage() {
      let stage = this.layoutManager.base_getCurrentStage();
      if (!stage || stage === 'formal') return null;
      stage = this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
      return stage;
    },
    getCategoryName() {
      this._fixCategoriesTagsAll();
      return this._getCategoryName(this.item.atomCategoryId);
    },
    getTagName() {
      return this._getTagName(this.item.atomTags);
    },
    getTags() {
      // tags
      this._fixCategoriesTagsAll();
      if (!this.tagsAll) return null;
      // atomTags
      let atomTags = this.item.atomTags;
      if (!atomTags) return null;
      if (!Array.isArray(atomTags)) {
        atomTags = JSON.parse(atomTags);
      }
      // parse
      return atomTags.map(tagId => {
        return {
          tagId,
          tagName: this._getTagName(tagId),
        };
      });
    },
    _fixCategoriesTagsAll() {
      const atomClass = this.layoutManager.base.atomClass;
      const language = this.item.atomLanguage;
      const key1 = this._getKey(this.atomClass, this.language);
      const key2 = this._getKey(atomClass, language);
      if (key1 === key2) return true;
      // reset
      this.atomClass = atomClass;
      this.language = language;
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
      if (!this.item) return null;
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
      if (!this.item) return null;
      const categoryName = this.getCategoryName();
      if (!categoryName) return null;
      return (
        <f7-badge color="teal" class="eb-cursor-pointer" nativeOnClick={this.onClickCategory}>
          {categoryName}
        </f7-badge>
      );
    },
    _renderTags() {
      if (!this.layoutManager.base.ready) return;
      if (!this.item) return null;
      const tags = this.getTags();
      if (!tags) return null;
      const children = [];
      for (const item of tags) {
        children.push(
          <f7-badge
            key={item.tagId}
            color="blue"
            class="eb-cursor-pointer"
            nativeOnClick={() => {
              this.onClickTag(item.tagId);
            }}
          >
            {item.tagName}
          </f7-badge>
        );
      }
      return children;
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
          {this._renderTags()}
        </div>
      </f7-nav-title>
    );
  },
};
