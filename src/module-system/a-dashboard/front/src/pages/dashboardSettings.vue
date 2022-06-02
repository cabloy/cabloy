<template>
  <eb-page>
    <eb-navbar :title="$text('Dashboard')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <template v-if="!dashboard.lock">
        <eb-list-item link="#" :title="$text('Add Widget')" :onPerform="onPerformAddWidget">
          <f7-icon slot="media" f7="::add"></f7-icon>
        </eb-list-item>
        <eb-list-item link="#" :title="$text('Add Group')" :onPerform="onPerformAddGroup">
          <f7-icon slot="media" f7="::add"></f7-icon>
        </eb-list-item>
      </template>
      <template v-if="dashboard.scene !== 'manager'">
        <f7-list-item group-title>
          <div class="detail-list-title-container">
            <div class="actions-block actions-block-left">{{ $text('Profile List') }}</div>
            <eb-link
              class="actions-block actions-block-right"
              iconF7="::add"
              :onPerform="onPerformProfileCreate"
            ></eb-link>
          </div>
        </f7-list-item>
        <eb-list-item
          v-for="item of dashboardUsers"
          :key="item.id"
          :title="item.dashboardName"
          radio
          :checked="item.id === dashboardUserIdCurrent"
          :context="item"
          :onPerform="onPerformSwitch"
          swipeout
        >
          <eb-context-menu>
            <div slot="right">
              <div color="orange" :context="item" :onPerform="onPerformChangeName">{{ $text('Change Name') }}</div>
              <div v-if="item.id !== dashboardUserIdCurrent" color="red" :context="item" :onPerform="onPerformDelete">
                {{ $text('Delete') }}
              </div>
            </div>
          </eb-context-menu>
        </eb-list-item>
      </template>
    </f7-list>
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
    this.dashboard.$on('dashboard:profileChange', this.onDashboardProfileChange);
  },
  beforeDestroy() {
    this.dashboard.$off('dashboard:destroy', this.onDashboardDestroy);
    this.dashboard.$off('dashboard:profileChange', this.onDashboardProfileChange);
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
    onDashboardProfileChange(dashboardUserId) {
      this.dashboardUserIdCurrent = dashboardUserId;
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
      const dashboardName = await this.$view.dialog.prompt(
        this.$text('Please specify the dashboard name'),
        null,
        item.dashboardName
      );
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
      await this.dashboard.__saveDashboardUserNow();
      // change default
      await this.dashboard.__changeProfileUserDefault({ dashboardUserId });
      // switch
      await this.dashboard.__switchProfile({ dashboardUserId });
      this.dashboardUserIdCurrent = dashboardUserId;
    },
    async onPerformProfileCreate() {
      await this.$view.dialog.confirm();
      // save
      await this.dashboard.__saveDashboardUserNow();
      // create dashboardUser
      const dashboardUser = await this.dashboard.__createDashboardUser();
      // switch
      await this.dashboard.__switchProfile({ dashboardUser });
      this.dashboardUserIdCurrent = dashboardUser.id;
    },
  },
};
</script>
