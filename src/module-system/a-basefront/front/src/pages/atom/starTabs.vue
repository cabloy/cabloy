<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar :scrollable="userLabels && Object.keys(userLabels).length>1">
          <eb-link :tab-link="`#${tabId.stars}`" :tabLinkActive="tabName==='stars'" icon-only icon-material="star_rate" badge-color="gray" :icon-badge="stats.stars" :stats_params="{module: 'a-base',name: 'stars'}" @stats_change="onStatsChange($event,'stars')"></eb-link>
          <template v-if="userLabels">
            <eb-link v-for="key of Object.keys(userLabels)" :key="key" :tab-link="`#${tabId.labels}_${key}`" :tabLinkActive="tabName===`${tabId.labels}_${key}`" :icon-badge="stats.labels[key]" :stats_params="{module: 'a-base',name: 'labels',nameSub: key}" @stats_change="onStatsChange($event,'labels',key)">{{userLabels[key].text}}</eb-link>
          </template>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabId.stars" :tabActive="tabName==='stars'" data-ref="stars" @tab:show="tabName='stars'">
        <starTab ref="stars" slot="list" :container="getContainer('stars')"></starTab>
      </eb-tab-page-content>
      <template v-if="userLabels">
        <eb-tab-page-content v-for="key of Object.keys(userLabels)" :key="key" :id="`${tabId.labels}_${key}`" :tabActive="tabName===`${tabId.labels}_${key}`" :data-ref="`${tabId.labels}_${key}`" @tab:show="tabName=`${tabId.labels}_${key}`">
          <starTab :ref="`${tabId.labels}_${key}`" slot="list" :container="getContainer('labels',key)"></starTab>
        </eb-tab-page-content>
      </template>
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
    const layout = query && query.layout;
    return {
      layout,
      stats: {
        stars: 0,
        labels: {},
      },
      tabId: {
        stars: Vue.prototype.$meta.util.nextId('stars'),
        labels: Vue.prototype.$meta.util.nextId('labels'),
      },
      tabName: 'stars',
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
    userLabels() {
      return this.$store.getState('a/base/userLabels');
    },
  },
  created() {
    // labels
    this.$store.dispatch('a/base/getLabels');
  },
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
