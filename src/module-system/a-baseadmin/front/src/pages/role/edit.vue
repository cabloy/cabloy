<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar v-if="role" top tabbar scrollable>
          <f7-link :tab-link="`#${tabIdInfo}`" tab-link-active>{{$text('Info')}}</f7-link>
          <f7-link v-if="role.catalog===0" :tab-link="`#${tabIdUsers}`">{{$text('Users')}}</f7-link>
          <f7-link v-if="role.catalog===1" :tab-link="`#${tabIdChildren}`">{{$text('Children')}}</f7-link>
          <f7-link :tab-link="`#${tabIdIncludes}`">{{$text('Includes')}}</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="role">
      <f7-page-content :id="tabIdInfo" tab tab-active @tab:show="tabName='info'">
        <info ref="info" :role="role"></info>
      </f7-page-content>
      <eb-tab-page-content v-if="role.catalog===0" :id="tabIdUsers" @tab:show="tabName='users'">
        <role-users slot="list" :roleId="role.id"></role-users>
      </eb-tab-page-content>
      <eb-tab-page-content v-if="role.catalog===1" :id="tabIdChildren" @tab:show="tabName='children'">
        <role-children ref="children" slot="list" :role="role"></role-children>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdIncludes" @tab:show="tabName='includes'">
        <role-includes ref="includes" slot="list" :role="role"></role-includes>
      </eb-tab-page-content>
    </f7-tabs>
    <f7-toolbar v-if="tabName==='info'" bottom-md>
      <eb-link :onPerform="onPerformInfoSave">{{$text('Save')}}</eb-link>
      <eb-link v-if="role && !role.system" :onPerform="onPerformInfoMove">{{$text('Move')}}</eb-link>
      <eb-link v-if="role && !role.system" :onPerform="onPerformInfoDelete">{{$text('Delete')}}</eb-link>
    </f7-toolbar>
    <f7-toolbar v-if="tabName==='users'" bottom-md>
    </f7-toolbar>
    <f7-toolbar v-if="tabName==='children'" bottom-md>
      <eb-link :onPerform="onPerformChildrenAdd">{{$text('New Role')}}</eb-link>
      <eb-link :onPerform="onPerformChildrenAddCatalog">{{$text('New Catalog')}}</eb-link>
    </f7-toolbar>
    <f7-toolbar v-if="tabName==='includes'" bottom-md>
      <eb-link :onPerform="onPerformIncludesAdd">{{$text('Add Role Include')}}</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import info from '../../components/role/info.vue';
import roleChildren from '../../components/role/children.vue';
import roleIncludes from '../../components/role/includes.vue';
import roleUsers from '../../components/user/list.vue';
export default {
  components: {
    info,
    roleChildren,
    roleIncludes,
    roleUsers,
  },
  data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      role: null,
      tabIdInfo: Vue.prototype.$meta.util.nextId('tab'),
      tabIdUsers: Vue.prototype.$meta.util.nextId('tab'),
      tabIdChildren: Vue.prototype.$meta.util.nextId('tab'),
      tabIdIncludes: Vue.prototype.$meta.util.nextId('tab'),
      tabName: 'info',
    };
  },
  created() {
    this.$api.post('role/item', { roleId: this.roleId })
      .then(data => {
        this.role = data;
      });
  },
  methods: {
    getPageTitle() {
      let title = this.$text('Role');
      if (this.role) title = `${title}: ${this.role.roleName}`;
      return title;
    },
    onPerformInfoSave() {
      return this.$refs.info.onPerformSave();
    },
    onPerformInfoMove() {
      return this.$refs.info.onPerformMove();
    },
    onPerformInfoDelete() {
      return this.$refs.info.onPerformDelete();
    },
    onPerformChildrenAdd() {
      return this.$refs.children.onPerformAdd();
    },
    onPerformChildrenAddCatalog() {
      return this.$refs.children.onPerformAddCatalog();
    },
    onPerformIncludesAdd() {
      return this.$refs.includes.onPerformAdd();
    },
  },
};

</script>
