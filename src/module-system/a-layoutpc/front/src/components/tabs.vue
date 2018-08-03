<script>
export default {
  render(c) {
    const children = [];
    for (const group of this.groups) {
      children.push(c('f7-link', {
        attrs: { tabLink: `#${group.id}`, tabLinkActive: group.active },
        domProps: { innerText: group.title },
      }));
    }
    const toolbar = c('f7-toolbar', { attrs: { tabbar: true, scrollable: true } }, children);
    return toolbar;
  },
  computed: {
    groups() {
      return this.$parent.$parent.groups;
    },
  },
};

</script>
<style scoped>


</style>
