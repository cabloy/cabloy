<script>
import Views from './views.vue';

export default {
  components: {
    ebViews: Views,
  },
  render(c) {
    const children = [];
    for (const tab of this.tabs) {
      const views = c('eb-views', {
        staticClass: 'eb-layout-views',
        props: { groupId: tab.id, views: tab.views },
      });
      children.push(c('f7-tab', {
        staticClass: 'eb-layout-group',
        attrs: { ref: tab.id, key: tab.id, id: tab.id, tabActive: tab.active },
      }, [ views ]));
    }
    const tabs = c('f7-tabs', { staticClass: 'eb-layout-groups' }, children);
    return tabs;
  },
  computed: {
    tabs() {
      return this.$parent.tabs;
    },
  },
};

</script>
<style scoped>


</style>
