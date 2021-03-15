<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <eb-link :tab-link="`#${tabId.mine}`" :tabLinkActive="tabName==='mine'" icon-only icon-material="person" badge-color="orange" :icon-badge="stats.mine" :stats_params="{module: 'a-flow',name: 'flowInitiateds'}" @stats_change="onStatsChange($event,'mine')"></eb-link>
          <eb-link :tab-link="`#${tabId.others}`" :tabLinkActive="tabName==='others'" icon-only icon-material="people"></eb-link>
          <eb-link :tab-link="`#${tabId.history}`" :tabLinkActive="tabName==='history'" icon-only icon-material="stop"></eb-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabId.mine" :tabActive="tabName==='mine'" data-ref="mine" @tab:show="tabName='mine'">
        <flowTab ref="mine" slot="list" :container="getContainer('mine')"></flowTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.others" :tabActive="tabName==='others'" data-ref="others" @tab:show="tabName='others'">
        <flowTab ref="others" slot="list" :container="getContainer('others')"></flowTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.history" :tabActive="tabName==='history'" data-ref="history" @tab:show="tabName='history'">
        <flowTab ref="history" slot="list" :container="getContainer('history')"></flowTab>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import flowTab from '../components/tab/flowTab.jsx';
export default {
  components: {
    flowTab,
  },
  data() {
    const query = this.$f7route.query;
    const options = (query && query.options) ? JSON.parse(query.options) : { mode: 'mine' };
    const layout = query && query.layout;
    return {
      options,
      layout,
      stats: {
        mine: 0,
      },
      tabId: {
        mine: Vue.prototype.$meta.util.nextId('tab'),
        others: Vue.prototype.$meta.util.nextId('tab'),
        history: Vue.prototype.$meta.util.nextId('tab'),
      },
      tabName: options.mode,
    };
  },
  computed: {
    pageTitle() {
      const tabName = this.tabName;
      if (tabName === 'mine') {
        return `${this.$text('Initiateds')}`;
      } else if (tabName === 'others') {
        return `${this.$text('Participateds')}`;
      } else if (tabName === 'history') {
        return `${this.$text('Ends')}`;
      }
      return this.$text('Flow');
    },
  },
  created() {},
  methods: {
    getContainer(mode) {
      const options = { mode };
      if (mode === 'history') {
        options.where = {
          'a.flowStatus': 1,
        };
      }
      return {
        options,
        layout: this.layout,
      };
    },
    onStatsChange(event, mode) {
      this.stats[mode] = event;
    },
  },
};

</script>
