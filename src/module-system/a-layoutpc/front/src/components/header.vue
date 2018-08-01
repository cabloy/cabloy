<script>
import Buttons from './buttons.vue';
import Mine from './mine.vue';

export default {
  components: {
    ebButtons: Buttons,
    ebMine: Mine,
  },
  render(c) {
    const title = c('div', {
      staticClass: 'title',
      domProps: { innerText: this.$f7.params.name },
    });
    const tabs = c('div', {
      staticClass: 'tabs',
      domProps: { innerText: 'tabs' },
    });
    const buttons = c('eb-buttons', {
      staticClass: 'buttons',
    });
    const mine = c('eb-mine', {
      staticClass: 'mine',
    });
    return c('div', { staticClass: 'eb-layout-header' }, [ title, tabs, buttons, mine ]);
  },
};

</script>
<style scoped>


</style>
