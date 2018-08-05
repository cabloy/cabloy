<script>
import Tabs from './tabs.vue';
import Buttons from './buttons.vue';
import Mine from './mine.vue';

export default {
  components: {
    ebTabs: Tabs,
    ebButtons: Buttons,
    ebMine: Mine,
  },
  render(c) {
    const title = c('div', {
      staticClass: 'title',
      domProps: { innerText: this.$f7.params.name },
    });
    const tabs = c('eb-tabs', {
      ref: 'tabs',
      staticClass: 'tabs',
    });
    const buttons = c('eb-buttons', {
      staticClass: 'buttons',
    });
    const mine = c('eb-mine', {
      staticClass: 'mine',
    });
    return c('div', { staticClass: 'eb-layout-header' }, [ title, tabs, buttons, mine ]);
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
