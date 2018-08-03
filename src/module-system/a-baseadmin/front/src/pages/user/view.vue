<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-nav-right>
        <eb-link :eb-href="`user/rights?userId=${userId}`">Rights</eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar v-if="user" tabbar>
          <f7-link :tab-link="`#${tabIdInfo}`" tab-link-active>Info</f7-link>
          <f7-link :tab-link="`#${tabIdRoles}`">Roles</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="user">
      <f7-page-content :id="tabIdInfo" tab tab-active @tab:show="tabName='info'">
        <info ref="info" :user="user"></info>
      </f7-page-content>
      <eb-tab-page-content :id="tabIdRoles" @tab:show="tabName='roles'">
        <user-roles ref="roles" slot="list" :user="user"></user-roles>
      </eb-tab-page-content>
    </f7-tabs>
    <f7-toolbar v-if="tabName==='roles'" bottom-md>
      <eb-link :onPerform="onPerformRolesAdd">Add Role</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import info from '../../components/user/info.vue';
import userRoles from '../../components/user/roles.vue';
export default {
  components: {
    info,
    userRoles,
  },
  data() {
    return {
      userId: parseInt(this.$f7route.query.userId),
      user: null,
      tabIdInfo: Vue.prototype.$meta.util.nextId('tab'),
      tabIdRoles: Vue.prototype.$meta.util.nextId('tab'),
      tabName: 'info',
    };
  },
  created() {
    this.$api.post('user/item', { userId: this.userId })
      .then(data => {
        this.user = data;
      });
  },
  methods: {
    getPageTitle() {
      let title = this.$text('User');
      if (this.user) title = `${title}: ${this.user.userName}`;
      return title;
    },
    onPerformRolesAdd() {
      return this.$refs.roles.onPerformAdd();
    },
  },
};

</script>
