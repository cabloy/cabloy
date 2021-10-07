<template>
  <eb-page>
    <eb-navbar :title="$text('Flow Chart')" eb-back-link="Back"> </eb-navbar>
    <f7-list v-if="ready">
      <f7-list-group v-for="group of nodeBasesGroups" :key="group.name">
        <f7-list-item group-title :title="group.titleLocale"></f7-list-item>
        <eb-list-item
          v-for="item of group.items"
          :key="item.type"
          :title="item.titleLocale"
          link="#"
          :context="item"
          :onPerform="onPerformNode"
        >
          <div slot="media">
            <img class="media-node-base-icon" :src="getNodeMedia(item)" />
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      nodeBases: null,
    };
  },
  computed: {
    ready() {
      return this.nodeBases;
    },
    diagram() {
      return this.contextParams.diagram;
    },
    nodeBasesGroups() {
      const configGroups = this.$config.flowDef.groups;
      const groups = this.$meta.util.extend([], configGroups);
      for (const group of groups) {
        group.titleLocale = this.$text(group.title);
        group.items = [];
        for (const nodeType in this.nodeBases) {
          if (nodeType.indexOf(':') === -1) continue;
          const nodeBase = this.nodeBases[nodeType];
          if (nodeBase.group === group.name) {
            group.items.push({
              type: nodeType,
              ...nodeBase,
            });
          }
        }
      }
      return groups;
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
    },
    onDiagramDestroy() {
      this.$view.close();
    },
    getNodeMedia(item) {
      return this.$meta.util.combineFetchStaticPath(item.icon);
    },
    onPerformNode(event, nodeBase) {
      // addNode
      this.diagram.addNode(nodeBase);
      // back
      const inPanel = this.$view.inPanel();
      if (!inPanel) {
        this.$f7router.back();
      }
    },
  },
};
</script>
