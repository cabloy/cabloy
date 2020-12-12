<script>
import SidebarTabSection from './sidebarTabSection.vue';

import Vue from 'vue';
export default {
  components: {
    ebSidebarTabSection: SidebarTabSection,
  },
  render(c) {
    const tabs = [];
    const index = 0;
    for (const button of this.buttons) {
      tabs.push(c('eb-sidebar-tab-section', {
        key: this.layout._buttonFullName(button),
        props: {
          options: button,
          dragdropScene: this.dragdropScene,
        },
      }));
    }
    return c('div', {
      staticClass: 'eb-layout-sidebar-tabs-sections',
    }, tabs);
  },
  props: {
    side: {
      type: String,
    },
  },
  data() {
    return {
      buttonsReal: {},
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  computed: {
    layout() {
      return this.sidebar.layout;
    },
    sidebar() {
      return this.$parent;
    },
    buttons() {
      return this.sidebar.options.buttons;
    },
  },
  methods: {},
};

</script>
