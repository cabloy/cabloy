<script>
import Tabs from './tabs.vue';
import HeaderButtons from './headerButtons.vue';
import Mine from './mine.vue';

export default {
  components: {
    ebTabs: Tabs,
    ebHeaderButtons: HeaderButtons,
    ebMine: Mine,
  },
  render(c) {
    const title = c('div', {
      staticClass: 'title',
      domProps: { innerText: this.title },
    });
    const tabs = c('eb-tabs', {
      ref: 'tabs',
      staticClass: 'tabs',
    });
    const buttons = c('eb-header-buttons', {
      staticClass: 'buttons',
      props: {
        buttons: this.layout.sidebar.top.buttons,
      },
    });
    const mine = c('eb-mine', {
      staticClass: 'mine',
    });
    return c('div', { staticClass: 'eb-layout-header' }, [title, tabs, buttons, mine]);
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
  },
};

</script>
<style scoped>
</style>
