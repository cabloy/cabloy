<template>
  <eb-page ptr @ptr:refresh="onRefresh">
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
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
    <div v-if="items && items.length===0" class="text-align-center">{{$text('No data')}}</div>
  </eb-page>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      language: this.$f7route.query.language,
      items: null,
    };
  },
  computed: {
    title() {
      const _title = this.$text('Tags');
      return `${_title}: ${this.language}`;
    },
  },
  created() {
    this.reload();
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onRefresh(done) {
      done();
      this.reload();
    },
    reload() {
      // all tags
      const options = {
        where: { language: this.language },
        orders: [
          ['tagName', 'asc'],
        ],
      };
      this.$api.post('tag/list', {
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
      const url = this.combineAtomClass(`/a/cms/article/list?language=${item.language}&tagId=${item.id}&tagName=${encodeURIComponent(item.tagName)}`);
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
    }
  },
};

</script>
<style lang="less" scoped>
</style>
