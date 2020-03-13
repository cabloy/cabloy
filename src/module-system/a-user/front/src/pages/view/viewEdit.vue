<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="panelsUser">
      <eb-list-item v-for="panel of panelsUser" :key="_panelFullName(panel)" checkbox :checked="getPanelChecked(panel)" @change="onPanelChange($event,panel)" :title="panel.titleLocale">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      side: this.$f7route.query.side,
      panelsUser: null,
    };
  },
  created() {
    this.$store.dispatch('a/base/getUserPanels').then(panels => {
      this.panelsUser = panels;
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
