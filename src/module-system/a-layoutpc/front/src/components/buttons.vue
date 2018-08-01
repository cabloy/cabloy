<script>
export default {
  render(c) {
    const dashboard = c('eb-link', {
      attrs: { iconMaterial: 'dashboard' },
    });
    const atom = c('eb-link', {
      attrs: { iconMaterial: 'group_work' },
    });
    return c('div', [ dashboard, atom ]);
  },
};

</script>
<style scoped>


</style>
