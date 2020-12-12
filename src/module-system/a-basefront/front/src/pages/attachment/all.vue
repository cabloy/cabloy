<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar large largeTransparent :title="$text('Attachment List')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link :iconMaterial="order==='desc'?'arrow_downward':'arrow_upward'" :onPerform="onPerformSort"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.i_realName" link="#" :context="item" :onPerform="onItemClick">
        <div slot="root-start" class="header">
          <div class="userName">
            <eb-link :context="item" :onPerform="onPerformViewAtom">{{item.atomName}}</eb-link>
          </div>
          <div class="date">{{$meta.util.formatDateTimeRelative(item.i_createdAt)}}</div>
        </div>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="true"></eb-load-more>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;

export default {
  mixins: [ ebAtomActions ],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    let where = (query && query.where) ? JSON.parse(query.where) : null;
    // scene
    const scene = query && query.scene;
    if (scene === 'mine') {
      if (!where) where = {};
      const user = this.$store.state.auth.user.op;
      where['i.userId'] = user.id;
    }
    return {
      atomClass,
      where,
      order: 'desc',
      items: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {
  },
  mounted() {
    this.$meta.eventHub.$on('attachment:action', this.onAttachmentChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('attachment:action', this.onAttachmentChanged);
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
      // options
      const options = {
        where: {
          mode: 2,
          attachment: 1,
        },
        orders: [
          [ 'i_createdAt', this.order ],
        ],
        page: { index },
      };
      // where
      if (this.where) {
        options.where = this.where;
      }
      // fetch
      return this.$api.post('/a/file/file/all', {
        atomClass: this.atomClass,
        options,
      }).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    reload() {
      this.$refs.loadMore.reload();
    },
    onPerformSort() {
      this.order = this.order === 'desc' ? 'asc' : 'desc';
      this.reload();
    },
    onAttachmentChanged(data) {
      this.reload();
    },
    onPerformViewAtom(event, item) {
      const _action = this.getAction({
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'read',
      });
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item });
    },
    onItemClick(event, item) {
      if (this.$meta.config.base.jwt) {
        this.$api.post('/a/base/jwt/create').then(res => {
          this._openUrl(item, res.jwt);
        });
      } else {
        this._openUrl(item, null);
      }
    },
    _openUrl(item, jwt) {
      if (jwt) {
        window.open(this.$meta.util.combineQueries(item.i_downloadUrl, { 'eb-jwt': jwt }));
      } else {
        window.open(item.i_downloadUrl);
      }
    },
  },
};

</script>
