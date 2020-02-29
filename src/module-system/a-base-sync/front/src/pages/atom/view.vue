<template>
  <item :query="query" mode="view"></item>
</template>
<script>
import item from '../../components/atom/item.vue';
export default {
  meta: {
    size: 'medium',
  },
  components: {
    item,
  },
  data() {
    return {
      query: this.$f7route.query,
    };
  },
};

</script>
<style scoped>
</style>
