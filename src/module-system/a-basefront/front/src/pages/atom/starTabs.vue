<template>
  <eb-page :page-content="false" tabs>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar :scrollable="userLabels && Object.keys(userLabels).length > 1">
          <eb-link
            :tab-link="`#${tabId.stars}`"
            :tabLinkActive="tabName === 'stars'"
            :text="$text('Stars')"
            badge-color="gray"
            :badge="stats.stars"
            :stats_params="{ module: 'a-base', name: 'stars' }"
            @stats_change="onStatsChange($event, 'stars')"
          ></eb-link>
          <template v-if="userLabels">
            <eb-link
              v-for="key of Object.keys(userLabels)"
              :key="key"
              :tab-link="`#${tabId.labels}_${key}`"
              :tabLinkActive="tabName === `${tabId.labels}_${key}`"
              :text="userLabels[key].text"
              :badge-color="userLabels[key].color"
              :badge="stats.labels[key]"
              :stats_params="{ module: 'a-base', name: 'labels', nameSub: key }"
              @stats_change="onStatsChange($event, 'labels', key)"
            ></eb-link>
          </template>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content
        :id="tabId.stars"
        :tabActive="tabName === 'stars'"
        data-ref="stars"
        @tab:show="tabName = 'stars'"
      >
        <AtomList ref="stars" slot="list" :container="getContainer('stars')"></AtomList>
      </eb-tab-page-content>
      <template v-if="userLabels">
        <eb-tab-page-content
          v-for="key of Object.keys(userLabels)"
          :key="key"
          :id="`${tabId.labels}_${key}`"
          :tabActive="tabName === `${tabId.labels}_${key}`"
          :data-ref="`${tabId.labels}_${key}`"
          @tab:show="tabName = `${tabId.labels}_${key}`"
        >
          <AtomList :ref="`${tabId.labels}_${key}`" slot="list" :container="getContainer('labels', key)"></AtomList>
        </eb-tab-page-content>
      </template>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import AtomList from '../../components/atom/atomList.jsx';
export default {
  components: {
    AtomList,
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
      if (tabName === 'stars') {
        return `${this.$text('Stars')}`;
      }
      const arr = this.tabName.split('_');
      const labelId = arr[arr.length - 1];
      return this.userLabels[labelId].text;
    },
    userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    // labels
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    getContainer(mode, labelId) {
      const options = { stage: 'formal' };
      if (mode === 'stars') {
        options.star = 1;
      } else {
        options.label = parseInt(labelId);
      }
      return {
        options,
        layout: this.layout,
        autoInit: false,
      };
    },
    onStatsChange(event, mode, labelId) {
      if (mode === 'stars') {
        this.stats[mode] = event;
      } else {
        this.$set(this.stats.labels, labelId, event);
      }
    },
  },
};
</script>
