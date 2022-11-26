<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <eb-link
            :tab-link="`#${tabId.drafts}`"
            :tabLinkActive="tabName === 'drafts'"
            :text="$text('Drafts')"
            badge-color="orange"
            :badge="stats.drafts"
            :stats_params="{ module: 'a-base', name: 'drafts' }"
            @stats_change="onStatsChange($event, 'drafts')"
          ></eb-link>
          <eb-link
            :tab-link="`#${tabId.draftsFlowing}`"
            :tabLinkActive="tabName === 'draftsFlowing'"
            :text="$text('DraftsFlowingMineTab')"
            badge-color="gray"
            :badge="stats.draftsFlowing"
            :stats_params="{ module: 'a-base', name: 'draftsFlowing' }"
            @stats_change="onStatsChange($event, 'draftsFlowing')"
          ></eb-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content
        :id="tabId.drafts"
        :tabActive="tabName === 'drafts'"
        data-ref="drafts"
        @tab:show="tabName = 'drafts'"
      >
        <AtomList ref="drafts" slot="list" :container="getContainer('drafts')"></AtomList>
      </eb-tab-page-content>
      <eb-tab-page-content
        :id="tabId.draftsFlowing"
        :tabActive="tabName === 'draftsFlowing'"
        data-ref="draftsFlowing"
        @tab:show="tabName = 'draftsFlowing'"
      >
        <AtomList ref="draftsFlowing" slot="list" :container="getContainer('draftsFlowing')"></AtomList>
      </eb-tab-page-content>
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
        drafts: 0,
        draftsFlowing: 0,
      },
      tabId: {
        drafts: Vue.prototype.$meta.util.nextId('drafts'),
        draftsFlowing: Vue.prototype.$meta.util.nextId('draftsFlowing'),
      },
      tabName: 'drafts',
    };
  },
  computed: {
    pageTitle() {
      const tabName = this.tabName;
      if (tabName === 'drafts') {
        return this.$text('Drafts');
      }
      return this.$text('DraftsFlowingMineTab');
    },
  },
  created() {},
  methods: {
    getContainer(mode) {
      const options = { stage: 'draft', mine: 1 };
      const params = {};
      if (mode === 'drafts') {
        options.where = {
          atomFlowId: 0,
        };
        params.actionOnClick = 'write';
      } else {
        options.where = {
          atomFlowId: { op: '>', val: 0 },
        };
      }
      return {
        options,
        params,
        layout: this.layout,
        autoInit: false,
      };
    },
    onStatsChange(event, mode) {
      this.stats[mode] = event;
    },
  },
};
</script>
