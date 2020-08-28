<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Auth Management')" eb-back-link="Back"></eb-navbar>
    <f7-list form inline-labels no-hairlines-md v-if="ready">
      <f7-list-group v-for="group of itemsGroups" :key="group.id">
        <f7-list-item group-title :title="`${group.title} (${group.items.length})`"></f7-list-item>
        <eb-list-item v-for="item of group.items" :key="item.id" :link="getItemLink(item)" :eb-href="getItemHref(item)" swipeout>
          <div slot="title" :class="{'text-color-gray':!item.meta}">{{getItemTitle(item)}}</div>
          <eb-context-menu v-if="item.meta">
            <div slot="right">
              <div v-if="item.disabled===0" color="red" :context="item" :onPerform="onPerformDisable">{{$text('Disable')}}</div>
              <div v-else color="orange" :context="item" :onPerform="onPerformEnable">{{$text('Enable')}}</div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
      itemsGroups: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    },
  },
  created() {
    // fetch
    return this.$api.post('auth/list').then(data => {
      this.items = data;
      this.groupItems();
    });
  },
  methods: {
    groupItems() {
      this.itemsGroups = [
        { id: 'enabled', title: this.$text('Enabled'), items: [] },
        { id: 'disabled', title: this.$text('Disabled'), items: [] },
        { id: 'others', title: this.$text('Others'), items: [] },
      ];
      for (const item of this.items) {
        if (!item.meta) {
          this.itemsGroups[2].items.push(item);
        } else if (item.disabled === 0) {
          this.itemsGroups[0].items.push(item);
        } else if (item.disabled === 1) {
          this.itemsGroups[1].items.push(item);
        }
      }
    },
    getItemLink(item) {
      return item.meta && item.meta.mode === 'redirect' ? '#' : false;
    },
    getItemHref(item) {
      return item.meta && item.meta.mode === 'redirect' ? `auth/info?id=${item.id}` : '';
    },
    getItemTitle(item) {
      return item.meta ? item.meta.titleLocale : `${item.module}:${item.providerName}`;
    },
    onPerformDisable(event, item) {
      return this.onDisable(event, item, 1);
    },
    onPerformEnable(event, item) {
      return this.onDisable(event, item, 0);
    },
    onDisable(event, item, disabled) {
      return this.$api.post('auth/disable', { id: item.id, disabled }).then(() => {
        const index = this.items.findIndex(_item => _item.id === item.id);
        this.items[index].disabled = disabled;
        this.groupItems();
        this.$meta.util.swipeoutClose(event.target);
        return true;
      });
    },
  },
};

</script>
