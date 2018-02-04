<script>
export default {
  render(c) {
    const statusBar = c('f7-statusbar', { ref: 'statusbar' });
    const layout = c('eb-layout', { ref: 'layout' });
    return c(
      'div', [
        statusBar,
        layout,
      ]
    );
  },
  components: {},
};

</script>
<style scoped>


</style>
