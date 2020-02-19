<template>
  <div>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.atomId" :name="radioName" :radio="mode==='selectSearch' && params.selectMode==='single'" :checkbox="mode==='selectSearch' && params.selectMode==='multiple'" :link="(itemShow || mode==='selectSearch')?false:'#'" :context="item" :onPerform="onItemClick" swipeout @swipeout:opened="onSwipeoutOpened($event,item)" @contextmenu:opened="onSwipeoutOpened($event,item)" @change="onItemChange($event,item)">
        <template v-if="itemShow">
          <div slot="media">
            <img class="avatar avatar32" :src="getItemMetaMedia(item)">
          </div>
          <div slot="root-start" class="header">
            <div class="mediaLabel">
              <span>{{getItemMetaMediaLabel(item)}}</span>
            </div>
            <div>
              <span v-if="item.star">⭐</span>
              <span v-if="item.attachmentCount>0">🧷</span>
              <span v-if="item.attachmentCount>1">{{`${item.attachmentCount}&nbsp;`}}</span>
              <span v-if="item.commentCount>0">💬</span>
              <span v-if="item.commentCount>1">{{`${item.commentCount}&nbsp;`}}</span>
              <f7-badge v-for="flag of getItemMetaFlags(item)" :key="flag">{{flag}}</f7-badge>
              <f7-badge v-if="item.atomFlag>0">{{getFlagTitle(item)}}</f7-badge>
              <template v-if="item.labels && labels">
                <f7-badge v-for="label of JSON.parse(item.labels)" :key="label" :style="{backgroundColor:getLabel(label).color}">{{getLabel(label).text}}</f7-badge>
              </template>
            </div>
          </div>
          <div slot="title" class="title">
            <div class="date">
              <div>{{$text('Modification Time')}}</div>
              <div>{{$text('Created Time')}}</div>
            </div>
          </div>
          <div slot="after" class="after">
            <div class="date">{{$meta.util.formatDateTime(item.atomUpdatedAt)}}</div>
            <div class="date">{{$meta.util.formatDateTime(item.atomCreatedAt)}}</div>
          </div>
        </template>
        <template v-if="!itemShow">
          <div slot="media" v-if="mode!=='selectSearch'">
            <img class="avatar avatar32" :src="getItemMetaMedia(item)">
          </div>
          <div slot="root-start" class="header">
            <div class="mediaLabel">
              <span>{{getItemMetaMediaLabel(item)}}</span>
            </div>
            <div class="date">
              <span v-if="item.star">⭐</span>
              <span v-if="item.attachmentCount>0">🧷</span>
              <span v-if="item.attachmentCount>1">{{`${item.attachmentCount}&nbsp;`}}</span>
              <span v-if="item.commentCount>0">💬</span>
              <span v-if="item.commentCount>1">{{`${item.commentCount}&nbsp;`}}</span>
              <span>{{$meta.util.formatDateTimeRelative(item.atomUpdatedAt)}}</span>
            </div>
          </div>
          <div slot="title" class="title">
            <div>{{item.atomName}}</div>
          </div>
          <div slot="root-end" class="summary">
            {{ getItemMetaSummary(item) }}
          </div>
          <div slot="after" class="after">
            <f7-badge v-for="flag of getItemMetaFlags(item)" :key="flag">{{flag}}</f7-badge>
            <f7-badge v-if="item.atomFlag>0">{{getFlagTitle(item)}}</f7-badge>
            <template v-if="item.labels && labels">
              <f7-badge v-for="label of JSON.parse(item.labels)" :key="label" :style="{backgroundColor:getLabel(label).color}">{{getLabel(label).text}}</f7-badge>
            </template>
          </div>
        </template>
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
          <template v-if="mode==='select'">
            <div slot="right">
              <div color="yellow" :context="item" :onPerform="onItemSelectRemove">{{$text('Remove')}}</div>
            </div>
          </template>
          <template v-if="mode!=='select'">
            <div slot="right" v-if="!itemShow" :ready="!!item._actions">
              <template v-if="item._actions">
                <div v-for="(action,index) of item._actions" :key="action.id" :color="getActionColor(action,index)" :context="{item,action}" :onPerform="onAction">{{getActionTitle(action)}}</div>
              </template>
            </div>
          </template>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <eb-load-more ref="loadMore" v-if="!itemShow" :onLoadClear="onLoadClear" :onLoadMore="onLoadMore" :autoInit="false"></eb-load-more>
    <eb-popover ref="popoverAtomOrders" :ready="popoverOrdersReady">
      <f7-list v-if="popoverOrdersReady" inset>
        <eb-list-item v-for="atomOrder of atomOrders" :key="getAtomOrderKey(atomOrder)" popover-close link="#" :context="atomOrder" :onPerform="onPerformChangeAtomOrder">
          <f7-icon slot="media" :material="getAtomOrderStatus(atomOrder)"></f7-icon>
          <div slot="title">{{atomOrder.titleLocale}}</div>
        </eb-list-item>
      </f7-list>
    </eb-popover>
  </div>
</template>
<script>
import Vue from 'vue';
import ebAtomClasses from '../../common/atomClasses.js';
import ebAtomActions from '../../common/atomActions.js';
import ebAtomOrders from '../../common/atomOrders.js';
export default {
  mixins: [ebAtomClasses, ebAtomActions, ebAtomOrders],
  meta: {
    global: false,
  },
  props: {
    // mode: list/drafts/stars/labels/search/all / select/selectSearch
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
    where: {
      type: Object,
    },
  },
  data() {
    return {
      radioName: Vue.prototype.$meta.util.nextId('radio'),
      items: this.itemShow ? [this.itemShow] : [],
      atomOrderSelected: null,
      selectedAtomIds: null,
      selectedAtoms: null,
      query: '',
    };
  },
  computed: {
    labels() {
      return this.$local.getters('userLabels');
    },
    flags() {
      return this.$local.state.flags;
    },
    user() {
      return this.$store.state.auth.user.op;
    },
    popoverOrdersReady() {
      return !!this.ordersAll;
    },
    mode2() {
      if (this.mode === 'select') return 'all';
      if (this.mode === 'selectSearch') return 'search';
      return this.mode;
    },
    atomOrders() {
      if (!this.ordersAll) return null;
      // base
      const ordersBase = this.getOrdersOfBase();
      // atomClass
      const ordersAtomClass = this.atomClass ? this.getOrdersOfAtomClass(this.atomClass) : null;
      // atomOrders
      return ordersAtomClass ? ordersBase.concat(ordersAtomClass) : ordersBase;
    },
    atomOrderDefault() {
      let atomOrder;
      if (this.mode === 'list') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a',
        };
      } else if (this.mode === 'drafts') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a',
        };
      } else if (this.mode === 'stars') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'd',
        };
      } else if (this.mode.indexOf('labels') > -1) {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'e',
        };
      } else if (this.mode === 'search') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a',
        };
      } else if (this.mode === 'select') {
        atomOrder = {
          name: 'atomName',
          by: 'asc',
          tableAlias: 'a',
        };
      } else if (this.mode === 'selectSearch') {
        atomOrder = {
          name: 'atomName',
          by: 'asc',
          tableAlias: 'a',
        };
      } else {
        // default = all
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a',
        };
      }
      // ok
      return atomOrder;
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
          page: { index },
        };
      } else if (this.mode === 'drafts') {
        options = {
          where: { 'a.atomEnabled': 0 },
          page: { index },
        };
      } else if (this.mode === 'stars') {
        options = {
          star: 1,
          page: { index },
        };
      } else if (this.mode.indexOf('labels') > -1) {
        options = {
          label: this.mode.split('-')[1],
          page: { index },
        };
      } else if (this.mode === 'search' || this.mode === 'selectSearch') {
        // where
        const where = {};
        // advanced search / quick search
        const _query = (this.params && this.params.atomName) || this.query;
        if (_query) {
          where['a.atomName'] = { val: _query, op: 'like' };
        }
        if (this.params && this.params.atomClassExtra) {
          this.$utils.extend(where, this.params.atomClassExtra);
        }
        // options
        options = {
          where,
          page: { index },
        };
        // label
        if (this.params && this.params.label) {
          options.label = this.params.label;
        }
      } else if (this.mode === 'select') {
        // where
        const where = {};
        if (!this.selectedAtomIds) {
          this.selectedAtomIds = this.params.selectedAtomIds || [];
        }
        where['a.id'] = this.selectedAtomIds.length > 0 ? this.selectedAtomIds : null;
        // options
        options = {
          where,
          page: { index },
        };
      } else {
        // default = all
        // special: all = list + atomEnabled=0
        options = {
          page: { index },
        };
      }
      // where
      if (this.where) {
        options.where = this.$utils.extend({}, options.where, this.where);
      }
      // order
      const atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      options.orders = [
        [this.getAtomOrderKey(atomOrderCurrent), atomOrderCurrent.by],
      ];
      // mode
      options.mode = this.mode2;
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
      const star = item.star ? 0 : 1;
      return this._onStarSwitch(event, item, star, 'swipeoutClose');
    },
    onStarOff(event, item) {
      return this._onStarSwitch(event, item, 0, 'swipeoutDelete');
    },
    _onStarSwitch(event, item, star, swipeoutAction) {
      // anonymous
      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // key
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      //
      return this.$api.post('atom/star', {
        key,
        atom: { star },
      }).then(data => {
        this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
        this.$meta.util[swipeoutAction](event.target);
      });
    },
    onLabel(event, item) {
      // anonymous
      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // navigate
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
        if (this.mode === 'drafts' || this.mode === 'search' || this.mode === 'all') {
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
    getItemMetaFlags(item) {
      const flags = (item._meta && item._meta.flags);
      if (!flags) return [];
      if (Array.isArray(flags)) return flags;
      return flags.split(',');
    },
    getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$config.user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 32);
    },
    getItemMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    getItemMetaSummary(item) {
      const summary = (item._meta && item._meta.summary) || '';
      if (this.atomClass) {
        return summary;
      }
      const atomClass = this.getAtomClass({
        module: item.module,
        atomClassName: item.atomClassName,
      });
      if (!atomClass) return summary;
      return `${atomClass.titleLocale} ${summary}`;
    },
    getFlagTitle(item) {
      if (!this.flags) return null;
      const flag = this.flags[item.module][item.atomClassName][item.atomFlag];
      return flag ? flag.titleLocale : this.$text('Flag Not Found');
    },
    onItemClick(event, item) {
      if (this.itemShow || this.mode === 'selectSearch') return;
      return this.onAction(event, {
        item,
        action: {
          module: item.module,
          atomClassName: item.atomClassName,
          name: 'read',
        },
      });
    },
    openPopoverForAtomOrders(element) {
      const popover = this.$refs.popoverAtomOrders.$el;
      this.$f7.popover.open(popover, element);
    },
    getAtomOrderStatus(atomOrder) {
      const atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      if (this.getAtomOrderKey(atomOrderCurrent) === this.getAtomOrderKey(atomOrder)) {
        return atomOrderCurrent.by === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up';
      }
      return '';
    },
    onPerformChangeAtomOrder(event, atomOrder) {
      // switch
      const atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      if (this.getAtomOrderKey(atomOrderCurrent) === this.getAtomOrderKey(atomOrder)) {
        this.atomOrderSelected = {
          name: atomOrderCurrent.name,
          tableAlias: atomOrderCurrent.tableAlias,
          by: atomOrderCurrent.by === 'desc' ? 'asc' : 'desc',
        };
      } else {
        this.atomOrderSelected = atomOrder;
      }
      // reload
      this.reload(true);
    },
    onItemSelectRemove(event, item) {
      this.$view.dialog.confirm().then(() => {
        // remove from selectedAtomIds
        if (this.selectedAtomIds) {
          const index = this.selectedAtomIds.findIndex(_item => _item === item.atomId);
          if (index !== -1) {
            this.selectedAtomIds.splice(index, 1);
          }
        }
        // remove from list
        const index = this.items.findIndex(_item => _item.atomId === item.atomId);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      });
      // close
      // this.$meta.util.swipeoutClose(event.target);
    },
    onItemChange(event, item) {
      if (this.params.selectMode === 'single') {
        if (event.target.checked) {
          this.selectedAtoms = [item];
        }
      } else {
        if (!this.selectedAtoms) this.selectedAtoms = [];
        const index = this.selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
        if (event.target.checked && index === -1) {
          this.selectedAtoms.push(item);
        } else if (!event.target.checked && index > -1) {
          this.selectedAtoms.splice(index, 1);
        }
      }
    },
    getSelectedAtoms() {
      if (this.mode === 'selectSearch') {
        return this.selectedAtoms;
      }
      if (this.mode === 'select') {
        return this.items;
      }
    },
    updateSelectedAtoms(selectedAtoms) {
      if (!selectedAtoms || selectedAtoms.length === 0) return;
      let needReload = false;
      if (this.params.selectMode === 'single') {
        this.selectedAtomIds = [selectedAtoms[0].atomId];
        needReload = true;
      } else {
        if (!this.selectedAtomIds) this.selectedAtomIds = [];
        for (const item of selectedAtoms) {
          const index = this.selectedAtomIds.indexOf(item.atomId);
          if (index === -1) {
            this.selectedAtomIds.push(item.atomId);
            needReload = true;
          }
        }
      }
      if (needReload) {
        this.reload(true);
      }
    },
    getAtomOrderKey(atomOrder) {
      return atomOrder ? `${atomOrder.tableAlias}.${atomOrder.name}` : null;
    },
    onSearch(query) {
      this.query = query;
      if (!this.query) {
        this.items = [];
      } else {
        this.reload(true);
      }
    }
  },
};

</script>
