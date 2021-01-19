<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <eb-link :tab-link="`#${tabId.claimings}`" :tabLinkActive="tabName==='claimings'" icon-only icon-material="play_arrow" badge-color="red" :icon-badge="stats.claimings" :stats_params="{module: 'a-flowtask',name: 'taskClaimings'}" @stats_change="onStatsChange($event,'claimings')"></eb-link>
          <eb-link :tab-link="`#${tabId.handlings}`" :tabLinkActive="tabName==='handlings'" icon-only icon-material="fast_forward" badge-color="red" :icon-badge="stats.handlings" :stats_params="{module: 'a-flowtask',name: 'taskHandlings'}" @stats_change="onStatsChange($event,'handlings')"></eb-link>
          <eb-link :tab-link="`#${tabId.completeds}`" :tabLinkActive="tabName==='completeds'" icon-only icon-material="stop"></eb-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabId.claimings" :tabActive="tabName==='claimings'" data-ref="claimings" @tab:show="tabName='claimings'">
        <flowTaskTab ref="claimings" slot="list" :container="getContainer('claimings')"></flowTaskTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.handlings" :tabActive="tabName==='handlings'" data-ref="handlings" @tab:show="tabName='handlings'">
        <flowTaskTab ref="handlings" slot="list" :container="getContainer('handlings')"></flowTaskTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.completeds" :tabActive="tabName==='completeds'" data-ref="completeds" @tab:show="tabName='completeds'">
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
      stats: {
        claimings: 0,
        handlings: 0,
      },
      tabId: {
        claimings: Vue.prototype.$meta.util.nextId('tab'),
        handlings: Vue.prototype.$meta.util.nextId('tab'),
        completeds: Vue.prototype.$meta.util.nextId('tab'),
      },
      tabName: options.mode,
    };
  },
  computed: {
    pageTitle() {
      const tabName = this.tabName;
      if (tabName === 'claimings') {
        return `${this.$text('Claimings')}`;
      } else if (tabName === 'handlings') {
        return `${this.$text('Handlings')}`;
      } else if (tabName === 'completeds') {
        return `${this.$text('Completeds')}`;
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
    onStatsChange(event, mode) {
      this.stats[mode] = event;
    },
  },
};

</script>
