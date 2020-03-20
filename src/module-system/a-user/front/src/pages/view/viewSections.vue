<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="sectionsUser">
      <eb-list-item v-for="section of sectionsUser" :key="_sectionFullName(section)" checkbox :checked="getSectionChecked(section)" @change="onSectionChange($event,section)" :title="section.titleLocale">
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
      sectionsUser: null,
    };
  },
  created() {
    this.$store.dispatch('a/base/getUserSections').then(sections => {
      this.sectionsUser = sections;
    });
  },
  computed: {
    pageTitle() {
      return this.$text('Statusbar (Right)');
    },
    sectionsShow() {
      return this.$meta.vueLayout.sidebar[this.side].sections;
    },
  },
  methods: {
    onSectionChange(event, section) {
      const checked = event.target.checked;
      this.$nextTick(() => {
        if (checked) {
          this.$meta.vueLayout.openSection(this.side, section);
        } else {
          this.$meta.vueLayout.closeSection(this.side, section);
        }
      });
    },
    getSectionChecked(section) {
      const _item = this.sectionsShow.find(item => this._sectionFullName(item) === this._sectionFullName(section));
      return !!_item;
    },
    _sectionFullName(section) {
      if (section.module) return `${section.module}:${section.name}`;
      return section.name;
    },
  },
};

</script>
