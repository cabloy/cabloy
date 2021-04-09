<template>
  <eb-page>
    <eb-navbar :title="$text('Flow Chart')" eb-back-link="Back">
    </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of dashboardUsers" :key="item.id" :title="item.dashboardName" radio :checked="item.id===dashboardUserIdCurrent" :context="item" :onPerform="onPerformSwitch" swipeout>
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      nodeBases: null,
      edgeBases: null,
    };
  },
  computed: {
    ready() {
      return this.nodeBases && this.edgeBases;
    },
    diagram() {
      return this.contextParams.diagram;
    },
  },
  created() {
    this.__load();
  },
  mounted() {
    this.diagram.$on('diagram:destroy', this.onDiagramDestroy);
  },
  beforeDestroy() {
    this.diagram.$off('diagram:destroy', this.onDiagramDestroy);
  },
  methods: {
    async __load() {
      this.nodeBases = await this.$local.dispatch('getNodeBases');
      this.edgeBases = await this.$local.dispatch('getEdgeBases');
    },
    onDiagramDestroy() {
      this.$view.close();
    },
  },
};

</script>
