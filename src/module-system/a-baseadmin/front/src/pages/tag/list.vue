<template>
  <eb-page ptr @ptr:refresh="onRefresh">
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" :onPerform="onPerformAdd"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.tagName" :badge="item.articleCount" link="#" :context="item" :onPerform="onItemClick" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="orange" close :context="item" :onPerform="onPerformEdit">{{$text('Edit')}}</div>
            <div color="red" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <div v-if="items && items.length===0" class="text-align-center">{{$text('No Data')}}</div>
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
    onRefresh(done) {
      done();
      this.reload();
    },
    reload() {
      // all tags
      const options = {
        where: { language: this.language },
        orders: [
          [ 'tagName', 'asc' ],
        ],
      };
      this.$api.post('/a/base/tag/list', {
        atomClass: this.atomClass,
        options,
      }).then(res => {
        this.items = res.list;
      });
    },
    onPerformAdd() {
      this.$view.dialog.prompt(this.$text('Please specify the tag name')).then(tagName => {
        if (!tagName) return;
        this.$api.post('tag/add', {
          atomClass: this.atomClass,
          data: {
            tagName,
            language: this.language,
          },
        }).then(() => {
          this.reload();
        });
      }).catch(() => {});
    },
    onItemClick(event, item) {
      // options
      const options = {
        mode: 'tag',
        where: {
          language: item.language,
          tagId: item.id,
        },
      };
      // params
      const params = {
        pageTitle: `${this.$text('Tag')}: ${item.tagName}`,
        disableFilter: true,
      };
      // queries
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
        options: JSON.stringify(options),
        params: JSON.stringify(params),
      };
      const url = this.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      this.$view.navigate(url, { target: '_self' });
    },
    onPerformEdit(event, item) {
      this.$view.dialog.prompt(this.$text('Please specify the new tag name')).then(tagName => {
        if (!tagName) return;
        this.$api.post('tag/save', {
          tagId: item.id,
          data: {
            tagName,
          },
        }).then(() => {
          const index = this.items.findIndex(_item => _item.id === item.id);
          if (index !== -1) {
            this.items.splice(index, 1, { ...item, tagName });
          }
        });
      }).catch(() => {});
    },
    onPerformDelete(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('tag/delete', { tagId: item.id }).then(() => {
          this.$meta.util.swipeoutClose(event.target);
          const index = this.items.findIndex(_item => _item.id === item.id);
          if (index !== -1) {
            this.items.splice(index, 1);
          }
        }).catch(err => this.$view.dialog.alert(err.message));
      });
    },
  },
};

</script>
<style lang="less" scoped>
</style>
