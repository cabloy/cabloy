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
          click: () => {
            this.layout.removeGroup(group.id);
            window.event.stopPropagation();
            window.event.preventDefault();
          },
        },
      });
      children.push(c('f7-link', {
        key: group.id,
        staticClass: 'no-auto',
        attrs: { tabLink: `#${group.id}` },
        on: {
          click: () => {
            this.$f7.tab.show(`#${group.id}`);
          },
        },
      }, [ text, close ]));
    }
    const toolbar = c('f7-toolbar', {
      ref: 'toolbar',
      attrs: { tabbar: true, scrollable: true },
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
};

</script>
<style scoped>


</style>
