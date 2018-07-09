<template>
  <f7-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar v-if="role" tabbar>
          <f7-link :tab-link="`#${tabIdRights}`" tab-link-active>Rights</f7-link>
          <f7-link :tab-link="`#${tabIdSpreads}`">Spreads</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="role">
      <eb-tab-page-content :id="tabIdRights" tab-active @tab:show="tabName='rights'">
        <rights ref="rights" slot="list" :role="role"></rights>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdSpreads" @tab:show="tabName='spreads'">
        <spreads ref="spreads" slot="list" :role="role"></spreads>
      </eb-tab-page-content>
    </f7-tabs>
    <f7-toolbar v-if="tabName==='rights'" bottom-md>
      <eb-link :onPerform="onPerformRightsAdd">Add Atom Right</eb-link>
    </f7-toolbar>
  </f7-page>
</template>
<script>
import Vue from 'vue';
import rights from '../../components/atomRight/rights.vue';
import spreads from '../../components/atomRight/spreads.vue';
export default {
  components: {
    rights,
    spreads,
  },
  data() {
    return {
      roleId: parseInt(this.$f7Route.query.roleId),
      role: null,
      tabIdRights: Vue.prototype.$meta.util.nextId('tab'),
      tabIdSpreads: Vue.prototype.$meta.util.nextId('tab'),
      tabName: 'rights',
    };
  },
  created() {
    this.$api.post('role/item', { roleId: this.roleId })
      .then(data => {
        this.role = data;
      })
  },
  methods: {
    getPageTitle() {
      let title = this.$text('Atom Right');
      if (this.role) title = `${title}: ${this.role.roleName}`;
      return title;
    },
    onPerformRightsAdd() {
      return this.$refs.rights.onPerformAdd();
    }
  }
};

</script>
