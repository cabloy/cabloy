<template>
  <eb-page>
    <eb-navbar :title="$text('Dashboard')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" :onPerform="onPerformNewProfile"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of dashboardUsers" :key="item.id" :title="item.dashboardName" radio :checked="item.id===dashboardUserIdCurrent" :context="item" :onPerform="onPerformSwitch" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformChangeName">{{$text('Change Name')}}</div>
            <div v-if="item.id!==dashboardUserIdCurrent" color="red" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <f7-toolbar bottom-md>
      <eb-button :onPerform="onPerformAddGroup">{{$text('Add Group')}}</eb-button>
      <eb-button :onPerform="onPerformAddWidget">{{$text('Add Widget')}}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      dashboardUserIdCurrent: parseInt(this.$f7route.query.dashboardUserId || 0),
      dashboardUsers: null,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
  },
  created() {
    this.__init();
  },
  mounted() {
    this.dashboard.$on('dashboard:destroy', this.onDashboardDestroy);
  },
  beforeDestroy() {
    this.dashboard.$off('dashboard:destroy', this.onDashboardDestroy);
  },
  methods: {
    __init() {
      // list
      this.$api.post('/a/dashboard/dashboard/itemUsers', {
        key: { atomId: this.dashboard.dashboardAtomId },
      }).then(data => {
        this.dashboardUsers = data;
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
      this.$view.navigate('/a/dashboard/widget/add', {
        target: '_self',
        context: {
          callback: (code, data) => {
            if (code === 200) {
              this.dashboard.onWidgetsAdd(data);
            }
          },
        },
      });
    },
    onPerformNewProfile() {
      return this.$view.dialog.prompt(this.$text('Please specify the profile name')).then(profileName => {
        if (!profileName) return;
        const profile = {
          profileName,
          profileValue: null,
        };
        return this.$api.post('profile/create', {
          data: profile,
        }).then(data => {
          profile.id = data.profileId;
          this.profiles.push(profile);
          return true;
        });
      });
    },
    async onPerformChangeName(e, item) {
      const dashboardUserId = item.id;
      const dashboardName = await this.$view.dialog.prompt(this.$text('Please specify the dashboard name'));
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
    onPerformDelete(e, item) {
      if (item.id === 0) return;
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('profile/delete', { profileId: item.id }).then(() => {
          const index = this.__getProfileIndexById(item.id);
          this.profiles.splice(index, 1);
          this.$meta.util.swipeoutClose(e.target);
          return true;
        });
      });
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
    __getProfileIndexById(profileId) {
      return this.profiles.findIndex(item => item.id === profileId);
    },
    __getProfileTitle(item) {
      return this.profileIdCurrent === item.id ? `${item.profileName} ⭐` : item.profileName;
    },
  },
};

</script>
