<template>
  <eb-page>
    <eb-navbar :title="$text('Auth Management')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item v-for="item of items" :key="item.id" :eb-href="`auth/edit?id=${item.id}`" :title="getModule(item.module).titleLocale" swipeout>
        <div slot="after">
          <f7-badge v-if="item.disabled===1">{{$text('Disabled')}}</f7-badge>
        </div>
        <eb-context-menu>
          <div slot="right">
            <div v-if="item.disabled===0" color="orange" :context="item" :onPerform="onPerformDisable">{{$text('Disable')}}</div>
            <div v-else color="orange" :context="item" :onPerform="onPerformEnable">{{$text('Enable')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-components').options.components.ebModules;
export default {
  mixins: [ ebModules ],
  data() {
    return {
      items: null,
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
        const index = this.items.findIndex(_item => _item.id === item.id);
        this.items[index].disabled = disabled;
        this.$meta.util.swipeoutClose(event.target);
        return true;
      });
    },
  },
};

</script>
