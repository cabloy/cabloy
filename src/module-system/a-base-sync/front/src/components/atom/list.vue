<template>
  <div>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.atomId" :link="itemShow?false:'#'" :context="item" :onPerform="onItemClick" swipeout @swipeout:opened="onSwipeoutOpened($event,item)" @contextmenu:opened="onSwipeoutOpened($event,item)">
        <div slot="root-start" class="header">
          <div class="userName">
            <span>{{item.userName}}</span>
            <f7-icon class="star" color="orange" :material="item.star?'star':''"></f7-icon>
          </div>
          <template v-if="itemShow">
            <div>
              <f7-badge v-if="item.atomFlag>0">{{getFlagTitle(item)}}</f7-badge>
              <template v-if="item.labels && labels">
                <f7-badge v-for="label of JSON.parse(item.labels)" :key="label" :style="{backgroundColor:getLabel(label).color}">{{getLabel(label).text}}</f7-badge>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="date">{{$meta.util.formatDateTimeRelative(item.atomUpdatedAt)}}</div>
          </template>
        </div>
        <div slot="title" class="title">
          <template v-if="itemShow">
            <div class="date">
              <div>{{$text('Modification time')}}</div>
              <div>{{$text('Created time')}}</div>
            </div>
          </template>
          <template v-else>
            <div>{{item.atomName}}</div>
          </template>
        </div>
        <div slot="after" class="after">
          <template v-if="itemShow">
            <div class="date">{{$meta.util.formatDateTime(item.atomUpdatedAt)}}</div>
            <div class="date">{{$meta.util.formatDateTime(item.atomCreatedAt)}}</div>
          </template>
          <template v-else>
            <f7-badge v-if="item.atomFlag>0">{{getFlagTitle(item)}}</f7-badge>
            <template v-if="item.labels && labels">
              <f7-badge v-for="label of JSON.parse(item.labels)" :key="label" :style="{backgroundColor:getLabel(label).color}">{{getLabel(label).text}}</f7-badge>
            </template>
          </template>
        </div>
        <eb-context-menu>
          <div slot="left">
            <template v-if="mode==='stars'">
              <div color="orange" :context="item" :onPerform="onStarOff">{{$text('Unstar')}}</div>
            </template>
            <template v-else>
              <div color="orange" :context="item" :onPerform="onStarSwitch">{{item.star?$text('Unstar'):$text('Star')}}</div>
            </template>
            <div color="yellow" :context="item" :onPerform="onLabel">{{$text('Labels')}}</div>
          </div>
          <div slot="right" v-if="!itemShow" :ready="!!item._actions">
            <template v-if="item._actions">
              <div v-for="(action,index) of item._actions" :key="action.id" :color="getActionColor(action,index)" :context="{item,action}" :onPerform="onAction">{{getActionTitle(action)}}</div>
            </template>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" v-if="!itemShow" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
  </div>
</template>
<script>
import Vue from 'vue';
import ebActions from '../../common/actions.js';
export default {
  mixins: [ ebActions ],
  meta: {
    global: false,
  },
  props: {
    // mode: list/drafts/stars/labels
    mode: {
      type: String,
    },
    itemShow: {
      type: Object,
    },
    params: {
      type: Object,
    },
    atomClass: {
      type: Object,
    },
  },
  data() {
    return {
      items: this.itemShow ? [ this.itemShow ] : [],
    };
  },
  computed: {
    labels() {
      return this.$local.state.labels;
    },
    flags() {
      return this.$local.state.flags;
    },
  },
  created() {
    this.$local.dispatch('getLabels');
    this.$local.dispatch('getFlags');
  },
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
  },
  methods: {
    reload(force) {
      if (this.itemShow) return;
      this.$refs.loadMore.reload(force);
    },
    loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore({ index }) {
      // options
      let options;
      if (this.mode === 'list') {
        options = {
          where: { 'a.atomEnabled': 1 },
          orders: [
            [ 'a.updatedAt', 'desc' ],
          ],
          page: { index },
        };
      } else if (this.mode === 'drafts') {
        options = {
          where: { 'a.atomEnabled': 0 },
          orders: [
            [ 'a.updatedAt', 'desc' ],
          ],
          page: { index },
        };
      } else if (this.mode === 'stars') {
        options = {
          orders: [
            [ 'd.updatedAt', 'desc' ],
          ],
          star: 1,
          page: { index },
        };
      } else if (this.mode.indexOf('labels') > -1) {
        options = {
          orders: [
            [ 'e.updatedAt', 'desc' ],
          ],
          label: this.mode.split('-')[1],
          page: { index },
        };
      } else if (this.mode === 'search') {
        // where
        const where = {};
        if (this.params.atomName) {
          where['a.atomName'] = { val: this.params.atomName, op: 'like' };
        }
        if (this.params.atomClassExtra) {
          this.$utils.extend(where, this.params.atomClassExtra);
        }
        // options
        options = {
          where,
          orders: [
            [ 'a.updatedAt', 'desc' ],
          ],
          page: { index },
        };
        // label
        if (this.params.label) {
          options.label = this.params.label;
        }
      }
      // fetch
      return this.$api.post('atom/select', {
        atomClass: this.atomClass,
        options,
      }).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    onStarSwitch(event, item) {
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      const star = item.star ? 0 : 1;
      return this.$api.post('atom/star', {
        key,
        atom: { star },
      }).then(() => {
        this.$meta.eventHub.$emit('atom:star', { key, star });
        this.$meta.util.swipeoutClose(event.target);
      });
    },
    onStarOff(event, item) {
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      return this.$api.post('atom/star', {
        key,
        atom: { star: 0 },
      }).then(() => {
        this.$meta.eventHub.$emit('atom:star', { key, star: 0 });
        this.$meta.util.swipeoutDelete(event.target);
      });
    },
    onLabel(event, item) {
      this.$view.navigate(`/a/base/atom/labels?atomId=${item.atomId}`);
    },
    onStarChanged(data) {
      const index = this.items.findIndex(item => item.atomId === data.key.atomId);
      if (this.mode === 'stars') {
        if (data.star === 0 && index !== -1) {
          this.items.splice(index, 1);
        } else if (data.star === 1 && index === -1) {
          this.reload();
        }
      } else {
        if (index !== -1) {
          this.items[index].star = data.star;
        }
      }
    },
    onLabelsChanged(data) {
      const index = this.items.findIndex(item => item.atomId === data.key.atomId);
      if (this.mode.indexOf('labels') > -1) {
        const mode = this.mode.split('-')[1];
        const exists = data.labels.indexOf(mode) > -1;
        if (!exists && index !== -1) {
          this.items.splice(index, 1);
        } else if (exists && index === -1) {
          this.reload();
        }
      } else {
        if (index !== -1) {
          this.items[index].labels = JSON.stringify(data.labels);
        }
      }
    },
    onActionChanged(data) {
      const key = data.key;
      const action = data.action;
      // create
      if (action.menu === 1 && action.action === 'create') {
        if (this.mode === 'drafts') {
          this.reload();
        }
        return;
      }
      // delete
      const index = this.items.findIndex(item => item.atomId === key.atomId);
      if (action.name === 'delete') {
        if (index !== -1) {
          this.items.splice(index, 1);
        }
        return;
      }
      // submit
      if (action.name === 'submit') {
        if (this.mode === 'list') {
          this.reload();
          return;
        } else if (this.mode === 'drafts' && index !== -1) {
          this.items.splice(index, 1);
          return;
        }
      }
      // others
      if (index !== -1) {
        this.$api.post('atom/read', {
          key,
        }).then(data => {
          Vue.set(this.items, index, data);
        });
      }
    },
    getLabel(id) {
      if (!this.labels) return null;
      return this.labels[id];
    },
    onSwipeoutOpened(event, item) {
      if (this.itemShow || item._actions) return;
      this.$api.post('atom/actions', {
        key: { atomId: item.atomId },
        basic: true,
      }).then(data => {
        Vue.set(item, '_actions', data);
      });
    },
    onAction(event, context) {
      const _action = this.getAction(context.action);
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item: context.item })
        .then(() => {
          this.$meta.util.swipeoutClose(event.target);
        });
    },
    getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'yellow';
      return 'blue';
    },
    getFlagTitle(item) {
      if (!this.flags) return null;
      return this.flags[item.module][item.atomClassName][item.atomFlag].titleLocale;
    },
    onItemClick(event, item) {
      if (this.itemShow) return;
      return this.onAction(event, {
        item,
        action: {
          module: item.module,
          atomClassName: item.atomClassName,
          name: 'read',
        },
      });
    },
  },
};

</script>
<style lang="less" scoped>
.item {
  .header {
    position: relative;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2px 8px -8px 16px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);

    .userName {
      display: flex;
      align-items: center;
    }

    .star {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  }

  .title {
    .date {
      font-size: 10px;
      color: rgba(0, 0, 0, 0.65);
    }
  }

  .after {
    .date {
      font-size: 10px;
      color: rgba(0, 0, 0, 0.50);
    }
  }
}

</style>
