<script>
export default {
  render(c) {
    const children = [];
    for (const group of this.groups) {
      const text = c('div', { domProps: { innerText: group.title } });
      const close = c('f7-icon', {
        staticClass: 'close',
        attrs: { material: 'close' },
        nativeOn: {
          click: event => {
            this.layout.removeGroup(group.id);
            event.stopPropagation();
            event.preventDefault();
          },
        },
      });
      children.push(c('eb-link', {
        ref: group.id,
        key: group.id,
        attrs: { tabLink: `#${group.id}` },
        props: {
          onPerform: () => {
            this.$f7.tab.show(`#${group.id}`);
          },
        },
      }, [ text, close ]));
    }
    const toolbar = c('f7-toolbar', {
      ref: 'toolbar',
      attrs: { top: true, tabbar: true, scrollable: true },
    }, children);
    return toolbar;
  },
  computed: {
    layout() {
      return this.$parent.$parent;
    },
    groups() {
      return this.layout.groups;
    },
  },
  methods: {
    isTabActive(groupId) {
      return this.$$(this.$refs[groupId].$el).hasClass('tab-link-active');
    },
  },
};

</script>
<style scoped>
</style>
