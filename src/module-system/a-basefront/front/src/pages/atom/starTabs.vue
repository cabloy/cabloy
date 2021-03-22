<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar :scrollable="userLabels && userLabels.length>1">
          <eb-link :tab-link="`#${tabId.stars}`" :tabLinkActive="tabName==='stars'" icon-only icon-material="person" badge-color="gray" :icon-badge="stats.stars" :stats_params="{module: 'a-base',name: 'stars'}" @stats_change="onStatsChange($event,'stars')"></eb-link>
          <eb-link :tab-link="`#${tabId.history}`" :tabLinkActive="tabName==='history'" icon-only icon-material="stop"></eb-link>
          <!-- <template v-if="labels">
            <eb-link v-for="label of Object.keys(labels)" :key="key" :tab-link="`#${tabIdLabels}_${key}`">{{labels[key].text}}</f7-link>
          </template> -->
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabId.mine" :tabActive="tabName==='mine'" data-ref="mine" @tab:show="tabName='mine'">
        <starTab ref="mine" slot="list" :container="getContainer('mine')"></starTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.others" :tabActive="tabName==='others'" data-ref="others" @tab:show="tabName='others'">
        <starTab ref="others" slot="list" :container="getContainer('others')"></starTab>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.history" :tabActive="tabName==='history'" data-ref="history" @tab:show="tabName='history'">
        <starTab ref="history" slot="list" :container="getContainer('history')"></starTab>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import starTab from '../../components/tab/starTab.jsx';
export default {
  components: {
    starTab,
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
