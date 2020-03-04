<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar v-if="role" top tabbar>
          <f7-link :tab-link="`#${tabIdRights}`" tab-link-active>{{$text('Rights')}}</f7-link>
          <f7-link :tab-link="`#${tabIdSpreads}`">{{$text('Spreads')}}</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="role">
      <eb-tab-page-content :id="tabIdRights" tab-active @tab:show="tabName='rights'">
        <rights ref="rights" slot="list" :role="role" :menu="menu"></rights>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdSpreads" @tab:show="tabName='spreads'">
        <spreads ref="spreads" slot="list" :role="role" :menu="menu"></spreads>
      </eb-tab-page-content>
    </f7-tabs>
    <f7-toolbar v-if="tabName==='rights'" bottom-md>
      <eb-link :onPerform="onPerformRightsAdd">{{buttonTitle}}</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import rights from '../../components/functionRight/rights.vue';
import spreads from '../../components/functionRight/spreads.vue';
const _types = ['Function', 'Menu', 'Panel', 'Widget'];
export default {
  components: {
    rights,
    spreads,
  },
  data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      menu: parseInt(this.$f7route.query.menu),
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
      });
  },
  computed: {
    pageTitle() {
      let title = this.$text(`${_types[this.menu]} Right`);
      if (this.role) title = `${title}: ${this.role.roleName}`;
      return title;
    },
    buttonTitle() {
      return this.$text(`New ${_types[this.menu]} Right`);
    },
  },
  methods: {
    onPerformRightsAdd() {
      return this.$refs.rights.onPerformAdd();
    },
  },
};

</script>
