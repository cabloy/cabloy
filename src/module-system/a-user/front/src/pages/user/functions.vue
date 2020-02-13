<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Functions')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="items">
      <f7-list-group v-for="group of itemGroups" :key="group">
        <f7-list-item :title="getModule(group).titleLocale" group-title></f7-list-item>
        <eb-list-item v-for="item of getGroupFunctions(group)" :key="item.name" link="#" :context="item" :onPerform="onItemClick" :title="item.titleLocale">
        </eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.components.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
    };
  },
  computed: {
    itemGroups() {
      if (!this.modulesAll) return [];
      return Object.keys(this.items);
    },
  },
  created() {
    // fetch
    return this.$api.post('user/functions').then(data => {
      this.items = data;
    });
  },
  methods: {
    getGroupFunctions(group) {
      return Object.values(this.items[group]);
    },
    onItemClick(event, item) {
      return this.$meta.util.performAction({ ctx: this, action: item, item });
    },
  },
};

</script>
