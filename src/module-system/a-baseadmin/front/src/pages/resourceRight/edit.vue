<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar v-if="role" top tabbar>
          <f7-link :tab-link="`#${tabIdRights}`" tab-link-active>{{ $text('Rights') }}</f7-link>
          <f7-link :tab-link="`#${tabIdSpreads}`">{{ $text('Spreads') }}</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="role">
      <eb-tab-page-content :id="tabIdRights" tab-active @tab:show="tabName = 'rights'">
        <rights ref="rights" slot="list" :role="role"></rights>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdSpreads" @tab:show="tabName = 'spreads'">
        <spreads ref="spreads" slot="list" :role="role"></spreads>
      </eb-tab-page-content>
    </f7-tabs>
    <f7-toolbar v-if="tabName === 'rights'" bottom-md>
      <eb-link :onPerform="onPerformRightsAdd">{{ $text('New Resource Rights') }}</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import rights from '../../components/resourceRight/rights.vue';
import spreads from '../../components/resourceRight/spreads.vue';
export default {
  components: {
    rights,
    spreads,
  },
  data() {
    return {
      roleAtomId: parseInt(this.$f7route.query.roleAtomId),
      roleId: parseInt(this.$f7route.query.roleId),
      role: null,
      tabIdRights: Vue.prototype.$meta.util.nextId('tab'),
      tabIdSpreads: Vue.prototype.$meta.util.nextId('tab'),
      tabName: 'rights',
    };
  },
  created() {
    this.loadRole();
  },
  methods: {
    async loadRole() {
      this.role = await this.$api.post('/a/base/atom/read', { key: { atomId: this.roleAtomId } });
    },
    getPageTitle() {
      let title = this.$text('Resource Authorization');
      if (this.role) title = `${title}: ${this.role.atomNameLocale || this.role.atomName}`;
      return title;
    },
    onPerformRightsAdd() {
      return this.$refs.rights.onPerformAdd();
    },
  },
};
</script>
