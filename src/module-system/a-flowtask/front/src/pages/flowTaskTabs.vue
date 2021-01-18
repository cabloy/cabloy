<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <f7-link :tab-link="`#${tabIdClaimings}`" :tabLinkActive="tabName==='claimings'">
            <f7-icon material="play_arrow"><eb-stats :params="{module: 'a-flowtask',name: 'taskClaimings',}" color="red"></eb-stats></f7-icon>
          </f7-link>
          <f7-link :tab-link="`#${tabIdHandlings}`" :tabLinkActive="tabName==='handlings'" icon-only icon-material="fast_forward" :icon-badge="0"></f7-link>
          <f7-link :tab-link="`#${tabIdCompleteds}`" :tabLinkActive="tabName==='completeds'" icon-only icon-material="done"></f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabIdClaimings" :tabActive="tabName==='claimings'" data-ref="claimings" @tab:show="tabName='claimings'">
        <flowTaskTab ref="claimings" slot="list" :container="getContainer('claimings')"></flowTaskTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdHandlings" :tabActive="tabName==='handlings'" data-ref="handlings" @tab:show="tabName='handlings'">
        <flowTaskTab ref="handlings" slot="list" :container="getContainer('handlings')"></flowTaskTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdCompleteds" :tabActive="tabName==='completeds'" data-ref="completeds" @tab:show="tabName='completeds'">
        <flowTaskTab ref="completeds" slot="list" :container="getContainer('completeds')"></flowTaskTab>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import flowTaskTab from '../components/tab/flowTaskTab.jsx';
export default {
  components: {
    flowTaskTab,
  },
  data() {
    const query = this.$f7route.query;
    const options = (query && query.options) ? JSON.parse(query.options) : { mode: 'claimings' };
    const layout = query && query.layout;
    return {
      options,
      layout,
      tabIdClaimings: Vue.prototype.$meta.util.nextId('tab'),
      tabIdHandlings: Vue.prototype.$meta.util.nextId('tab'),
      tabIdCompleteds: Vue.prototype.$meta.util.nextId('tab'),
      tabName: options.mode,
    };
  },
  computed: {
    pageTitle() {
      const tabName = this.tabName;
      if (tabName === 'claimings') {
        return `${this.$text('Task')}: ${this.$text('Claimings')}`;
      } else if (tabName === 'handlings') {
        return `${this.$text('Task')}: ${this.$text('Handlings')}`;
      } else if (tabName === 'completeds') {
        return `${this.$text('Task')}: ${this.$text('Completeds')}`;
      }
      return this.$text('Task');
    },
  },
  created() {
  },
  methods: {
    getContainer(mode) {
      return {
        options: { mode },
        layout: this.layout,
      };
    },
  },
};

</script>
