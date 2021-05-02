<script>
import Tabs from './tabs.vue';
import HeaderButtons from './headerButtons.vue';

export default {
  components: {
    ebTabs: Tabs,
    ebHeaderButtons: HeaderButtons,
  },
  render(c) {
    const title = c('eb-link', {
      staticClass: 'title',
      domProps: { innerText: this.title },
      props: {
        onPerform: () => {
          return this.onPerformClickTitle();
        },
      },
    });
    const tabs = c('eb-tabs', {
      ref: 'tabs',
      staticClass: 'tabs',
    });
    const buttons = c('eb-header-buttons', {
      staticClass: 'buttons',
      props: {
        side: 'top',
        buttons: this.layout.sidebar.top.buttons,
      },
    });
    return c('div', { staticClass: 'eb-layout-header' }, [ title, tabs, buttons ]);
  },
  computed: {
    title() {
      return this.$store.getters['auth/title'];
    },
    layout() {
      return this.$parent;
    },
  },
  methods: {
    isTabActive(groupId) {
      return this.$refs.tabs.isTabActive(groupId);
    },
    onPerformClickTitle() {
      const action = {
        actionPath: null,
        navigateOptions: {
          scene: 'sidebar',
          sceneOptions: {
            side: 'left',
            module: 'a-layoutpc',
            name: 'panelMenu',
          },
        },
      };
      this.$meta.util.performAction({ ctx: this, action, item: null });
    },
  },
};

</script>
<style scoped>
</style>
