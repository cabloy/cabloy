<template>
  <eb-page ptr @ptr:refresh="onRefresh">
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconF7="::add" :onPerform="onPerformAdd"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item
        class="item"
        v-for="item of items"
        :key="item.id"
        :title="item.tagName"
        :badge="item.tagAtomCount"
        link="#"
        :context="item"
        :onPerform="onItemClick"
        swipeout
      >
        <eb-context-menu>
          <div slot="right">
            <div color="orange" close :context="item" :onPerform="onPerformEdit">{{ $text('Edit') }}</div>
            <div color="red" :context="item" :onPerform="onPerformDelete">{{ $text('Delete') }}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <div v-if="items && items.length === 0" class="text-align-center">{{ $text('No Data') }}</div>
  </eb-page>
</template>
<script>
export default {
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    const languageTitle = query.languageTitle;
    return {
      atomClass,
      language,
      languageTitle,
      items: null,
    };
  },
  computed: {
    pageTitle() {
      const title = this.$text('Tags');
      if (!this.language) return title;
      return `${title}: ${this.languageTitle}`;
    },
  },
  created() {
    this.reload();
  },
  methods: {
    combineAtomClassAndLanguage() {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (this.language) {
        queries.language = this.language;
      }
      return queries;
    },
    onRefresh(done) {
      done();
      this.reload();
    },
    reload() {
      // all tags
      const options = {
        where: { language: this.language },
        orders: [['tagName', 'asc']],
      };
      this.$api
        .post('/a/base/tag/list', {
          atomClass: this.atomClass,
          options,
        })
        .then(res => {
          this.items = res.list;
        });
    },
    async onPerformAdd() {
      const tagName = await this.$view.dialog.prompt(this.$text('Please specify the tag name'));
      if (!tagName) return;
      await this.$api.post('/a/base/tag/add', {
        atomClass: this.atomClass,
        data: {
          tagName,
          language: this.language,
        },
      });
      this._clearSystemCache();
      this.reload();
    },
    async onItemClick(event, item) {
      await this.onPerformEdit(event, item);
    },
    async onPerformEdit(event, item) {
      const tagName = await this.$view.dialog.prompt(this.$text('Please specify the new tag name'));
      if (!tagName) return;
      await this.$api.post('/a/base/tag/save', {
        tagId: item.id,
        data: {
          tagName,
        },
      });
      this._clearSystemCache();
      const index = this.items.findIndex(_item => _item.id === item.id);
      if (index !== -1) {
        this.items.splice(index, 1, { ...item, tagName });
      }
    },
    async onPerformDelete(event, item) {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/base/tag/delete', { tagId: item.id });
      this._clearSystemCache();
      this.$meta.util.swipeoutClose(event.currentTarget);
      const index = this.items.findIndex(_item => _item.id === item.id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    _clearSystemCache() {
      this.$store.commit('a/base/setTags', {
        atomClass: this.atomClass,
        language: this.language,
        tags: null,
      });
    },
  },
};
</script>
<style lang="less" scoped></style>
