<script>
import Group from './group.vue';

export default {
  components: {
    ebGroup: Group,
  },
  render(c) {
    const children = [];
    for (const group of this.groups) {
      const _group = c('eb-group', {
        staticClass: 'eb-layout-views',
        props: { groupId: group.id, views: group.views },
      });
      children.push(c('f7-tab', {
        staticClass: `eb-layout-group${group.dashboard ? ' eb-layout-group-dashboard' : ''}`,
        attrs: { ref: group.id, key: group.id, id: group.id, tabActive: group.active, 'data-groupId': group.id },
      }, [ _group ]));
    }
    return c('f7-tabs', { staticClass: 'eb-layout-groups' }, children);
  },
  computed: {
    groups() {
      return this.$parent.groups;
    },
  },
};

</script>
<style scoped>


</style>
