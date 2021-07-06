<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar v-if="user" top tabbar>
          <f7-link :tab-link="`#${tabIdAtoms}`" tab-link-active>{{ $text('Atoms') }}</f7-link>
          <f7-link :tab-link="`#${tabIdResources}`">{{ $text('Resources') }}</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs v-if="user">
      <eb-tab-page-content :id="tabIdAtoms" tab-active @tab:show="tabName = 'atoms'">
        <atoms-spreads ref="atoms" slot="list" :user="user"></atoms-spreads>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdResources" @tab:show="tabName = 'resources'">
        <resources-spreads ref="resources" slot="list" :user="user"></resources-spreads>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import atomsSpreads from '../../components/atomRight/spreads.vue';
import resourcesSpreads from '../../components/resourceRight/spreads.vue';
export default {
  components: {
    atomsSpreads,
    resourcesSpreads,
  },
  data() {
    return {
      userId: parseInt(this.$f7route.query.userId),
      user: null,
      tabIdAtoms: Vue.prototype.$meta.util.nextId('tab'),
      tabIdResources: Vue.prototype.$meta.util.nextId('tab'),
      tabName: 'atoms',
    };
  },
  created() {
    this.$api.post('user/item', { userId: this.userId }).then(data => {
      this.user = data;
    });
  },
  methods: {
    getPageTitle() {
      let title = this.$text('User');
      if (this.user) title = `${title}: ${this.user.userName}`;
      return title;
    },
  },
};
</script>
