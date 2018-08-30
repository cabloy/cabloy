<script>
export default {
  render(c) {
    const attrs = this.$utils.extend({}, this.$attrs);
    return c('f7-login-screen', { staticClass: `eb-layout-view-container eb-layout-view-container-${attrs.name}` }, [ c('eb-view', {
      staticClass: `eb-layout-view eb-layout-view-${attrs.name} eb-layout-view-size-small`,
      attrs,
    }) ]);
  },
  destroyed() {
    this.$el.remove();
  },
};

</script>
<style scoped>


</style>
