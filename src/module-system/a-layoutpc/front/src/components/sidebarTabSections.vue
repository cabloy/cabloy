<script>
import SidebarTabSection from './sidebarTabSection.vue';

import Vue from 'vue';
export default {
  components: {
    ebSidebarTabSection: SidebarTabSection,
  },
  render(c) {
    const tabs = [];
    let index = 0;
    for (const section of this.sections) {
      tabs.push(c('eb-sidebar-tab-section', {
        key: this.layout._sectionFullName(section),
        props: {
          options: section,
          dragdropScene: this.dragdropScene,
        },
      }));
    }
    return c('div', {
      staticClass: `eb-layout-sidebar-tabs-sections`,
    }, tabs);
  },
  props: {
    side: {
      type: String,
    }
  },
  data() {
    return {
      sectionsReal: {},
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    }
  },
  computed: {
    layout() {
      return this.sidebar.layout;
    },
    sidebar() {
      return this.$parent;
    },
    sections() {
      return this.sidebar.options.sections;
    },
  },
  methods: {}
}

</script>
