<template>
  <eb-page>
    <eb-navbar :title="$text('Dashboard')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="dashboard.scene !== 'manager'" iconMaterial="add" :onPerform="onPerformCreate"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of dashboardUsers" :key="item.id" :title="item.dashboardName" radio :checked="item.id === dashboardUserIdCurrent" :context="item" :onPerform="onPerformSwitch" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformChangeName">{{ $text('Change Name') }}</div>
            <div v-if="item.id !== dashboardUserIdCurrent" color="red" :context="item" :onPerform="onPerformDelete">{{ $text('Delete') }}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <f7-toolbar bottom-md>
      <eb-button :onPerform="onPerformAddGroup">{{ $text('Add Group') }}</eb-button>
      <eb-button :onPerform="onPerformAddWidget">{{ $text('Add Widget') }}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      dashboardUserIdCurrent: parseInt(this.$f7route.query.dashboardUserId || 0),
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
    dashboardUsers() {
      return this.$local.state.dashboardUsers[this.dashboard.dashboardAtomId];
    },
  },
  created() {
    this.__load();
  },
  mounted() {
    this.dashboard.$on('dashboard:destroy', this.onDashboardDestroy);
  },
  beforeDestroy() {
    this.dashboard.$off('dashboard:destroy', this.onDashboardDestroy);
  },
  methods: {
    async __load() {
      if (this.dashboard.scene === 'manager') return;
      // list
      await this.$local.dispatch('getDashboardUsers', {
        dashboardAtomId: this.dashboard.dashboardAtomId,
      });
    },
    __findItem(dashboardUserId) {
      const index = this.dashboardUsers.findIndex(item => item.id === dashboardUserId);
      if (index === -1) return { item: null, index };
      return { item: this.dashboardUsers[index], index };
    },
    onDashboardDestroy() {
      this.$view.close();
    },
    onPerformAddGroup() {
      this.dashboard.onGroupAdd();
    },
    onPerformAddWidget() {
      this.dashboard.onPerformAddWidget(this, this.dashboard);
    },
    async onPerformChangeName(e, item) {
      const dashboardUserId = item.id;
      const dashboardName = await this.$view.dialog.prompt(this.$text('Please specify the dashboard name'), null, item.dashboardName);
      if (!dashboardName || dashboardName === item.dashboardName) return;
      await this.$api.post('/a/dashboard/dashboard/changeItemUserName', {
        dashboardUserId,
        dashboardName,
      });
      const res = this.__findItem(dashboardUserId);
      res.item.dashboardName = dashboardName;
      if (this.dashboardUserIdCurrent === dashboardUserId) {
        this.dashboard.__setTitle(dashboardName);
      }
      this.$meta.util.swipeoutClose(e.target);
    },
    async onPerformDelete(e, item) {
      const dashboardUserId = item.id;
      if (this.dashboardUserIdCurrent === dashboardUserId) return;
      await this.$view.dialog.confirm();
      await this.$api.post('/a/dashboard/dashboard/deleteItemUser', {
        dashboardUserId,
      });
      const res = this.__findItem(dashboardUserId);
      this.dashboardUsers.splice(res.index, 1);
      this.$meta.util.swipeoutClose(e.target);
    },
    async onPerformSwitch(e, item) {
      const dashboardUserId = item.id;
      if (this.dashboardUserIdCurrent === dashboardUserId) return;
      // save
      await this.dashboard.__saveDashboardUser();
      // change default
      await this.$api.post('/a/dashboard/dashboard/changeItemUserDefault', {
        key: { atomId: this.dashboard.dashboardAtomId },
        dashboardUserId,
      });
      // switch
      await this.dashboard.__switchProfile({ dashboardUserId });
      this.dashboardUserIdCurrent = dashboardUserId;
    },
    async onPerformCreate() {
      await this.$view.dialog.confirm();
      // save
      await this.dashboard.__saveDashboardUser();
      // create dashboardUser
      const dashboardUserId = await this.dashboard.__createDashboardUser();
      // switch
      await this.dashboard.__switchProfile({ dashboardUserId });
      this.dashboardUserIdCurrent = dashboardUserId;
    },
  },
};
</script>
