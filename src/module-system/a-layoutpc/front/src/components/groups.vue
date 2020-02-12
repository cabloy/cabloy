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
        ref: group.id,
        staticClass: 'eb-layout-views',
        props: { groupId: group.id, views: group.views },
      });
      children.push(c('f7-tab', {
        key: group.id,
        staticClass: `eb-layout-group${group.dashboard ? ' eb-layout-group-dashboard' : ''}`,
        attrs: { id: group.id, 'data-groupId': group.id },
        on: { 'tab:show': this.onTabShow },
      }, [_group]));
    }
    return c('f7-tabs', { staticClass: 'eb-layout-groups' }, children);
  },
  computed: {
    layout() {
      return this.$parent;
    },
    groups() {
      return this.$parent.groups;
    },
  },
  methods: {
    reLayout(groupId) {
      this.$refs[groupId].reLayout();
    },
    resizeGroup(groupId) {
      this.$refs[groupId].resize();
    },
    getView(groupId, viewId) {
      return this.$refs[groupId].getView(viewId);
    },
    onTabShow(e) {
      if (!e) return;
      this.$nextTick(() => {
        const groupId = this.$$(e.target).data('groupId');
        const tabLink = this.layout.$refs.header.$refs.tabs.$refs[groupId];
        if (tabLink) {
          tabLink.$el.scrollIntoView(false);
        }
      });
    },
  },
};

</script>
<style scoped>
</style>
