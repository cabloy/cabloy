<template>
  <f7-page>
    <eb-navbar :title="$text('Auth Management')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item v-for="item of items" :key="item.id" :eb-href="`auth/edit?id=${item.id}`" :title="getModule(item.module).titleLocale" swipeout>
        <div slot="after">
          <f7-badge v-if="item.disabled===1">disabled</f7-badge>
        </div>
        <f7-swipeout-actions>
          <eb-swipeout-button v-if="item.disabled===0" color="orange" :context="item" :onPerform="onPerformDisable">Disable</eb-swipeout-button>
          <eb-swipeout-button v-else color="orange" :context="item" :onPerform="onPerformEnable">Enable</eb-swipeout-button>
        </f7-swipeout-actions>
      </eb-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-components').options.components.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    }
  },
  created() {
    // fetch
    return this.$api.post(`auth/list`).then(data => {
      this.items = data;
    });
  },
  methods: {
    onPerformDisable(event, item) {
      return this.onDisable(event, item, 1);
    },
    onPerformEnable(event, item) {
      return this.onDisable(event, item, 0);
    },
    onDisable(event, item, disabled) {
      return this.$api.post('auth/disable', { id: item.id, disabled }).then(() => {
        item.disabled = disabled;
        this.$meta.util.swipeoutClose(event.target);
        return true;
      });
    }
  },
};

</script>
