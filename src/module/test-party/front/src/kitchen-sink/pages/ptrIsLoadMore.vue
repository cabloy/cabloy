<template>
  <eb-page ptr ptrMousewheel @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="$text('Pull To Refresh / Infinite Scroll / Load More')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of items" :key="item.id" :title="item.title" link="#" :context="item" :onPerform="onItemClick" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    onRefresh(done) {
      done();
      this.reload();
    },
    onInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore({ index }) {
      // fetch
      return this.$api.post('kitchen-sink/ptr-is-loadmore/list', {
        page: { index },
      }).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    reload() {
      this.$refs.loadMore.reload();
    },
    onPerformDelete(event, item) {
      // delete
      return this.$view.dialog.confirm().then(() => {
        this.$meta.util.swipeoutClose(event.target);
        this.deleteItem(item.id);
      });
    },
    deleteItem(itemId) {
      const index = this.items.findIndex(item => item.id === itemId);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    onItemClick(event, item) {
      this.$view.toast.show({ text: `${item.title} clicked` });
    },
  },
};

</script>
