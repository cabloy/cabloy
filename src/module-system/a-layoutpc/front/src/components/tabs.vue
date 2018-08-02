<script>
export default {
  render(c) {
    const children = [];
    for (const tab of this.tabs) {
      children.push(c('f7-link', {
        attrs: { tabLink: `#${tab.id}`, tabLinkActive: tab.active },
        domProps: { innerText: tab.title },
      }));
    }
    const toolbar = c('f7-toolbar', { attrs: { tabbar: true, scrollable: true } }, children);
    return toolbar;
  },
  computed: {
    tabs() {
      return this.$parent.$parent.tabs;
    },
  },
};

</script>
<style scoped>


</style>
