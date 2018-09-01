<script>
export default {
  meta: {
    size: 'middle',
  },
  render(c) {
    if (!this.moduleBase) return c('div');
    return c('item', {
      props: {
        query: this.query,
        mode: 'edit',
      },
    });
  },
  data() {
    return {
      query: this.$f7route.query,
      moduleBase: null,
    };
  },
  created() {
    // module
    this.$meta.module.use('a-base', module => {
      this.moduleBase = module;
      this.$options.components.item = require('../../components/article/item.vue').default;
    });
  },
};

</script>
<style scoped>


</style>
