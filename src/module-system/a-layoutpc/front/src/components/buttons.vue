<script>
export default {
  render(c) {
    const children = [];
    for (const button of this.$config.layout.header.buttons) {
      const props = {
        iconMaterial: button.iconMaterial,
        ebHref: button.url,
      };
      children.push(c('eb-link', { key: button.name, props }));
    }
    return c('div', children);
  },
};

</script>
<style scoped>


</style>
