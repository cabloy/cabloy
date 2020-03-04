<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="panelsAll">
      <f7-list-group v-for="group of itemGroups" :key="group">
        <f7-list-item :title="getModule(group).titleLocale" group-title></f7-list-item>
        <eb-list-item v-for="panel of getGroupPanels(group)" :key="_panelFullName(panel)" checkbox :checked="getPanelChecked(panel)" @change="onPanelChange($event,panel)" :title="panel.titleLocale">
        </eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.components.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      side: this.$f7route.query.side,
      panelsAll: null,
    };
  },
  created() {
    this.$store.dispatch('a/base/getPanels').then(panels => {
      this.panelsAll = panels;
      console.log(this.panelsAll);
    });
  },
  computed: {
    pageTitle() {
      const side = this.side;
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      return this.$text(`Sidebar (${sideUpperCase})`);
    },
    panelsShow() {
      return this.$meta.vueLayout.sidebar[this.side].panels;
    },
    itemGroups() {
      if (!this.panelsAll) return [];
      return Object.keys(this.panelsAll);
    },
  },
  methods: {
    onPanelChange(event, panel) {
      const checked = event.target.checked;
      this.$nextTick(() => {
        if (checked) {
          const sceneOptions = this.$utils.extend({}, panel, { side: this.side });
          this.$meta.vueLayout.navigate(null, { scene: 'sidebar', sceneOptions });
        } else {
          this.$meta.vueLayout.closePanel(this.side, panel);
        }
      });
    },
    getGroupPanels(group) {
      return Object.values(this.panelsAll[group]);
    },
    getPanelChecked(panel) {
      const _item = this.panelsShow.find(item => this._panelFullName(item) === this._panelFullName(panel));
      return !!_item;
    },
    _panelFullName(panel) {
      if (panel.module) return `${panel.module}:${panel.name}`;
      return panel.name;
    },
  },
};

</script>
