<template>
  <item :query="query" mode="edit"></item>
</template>
<script>
import Vue from 'vue';
import item from '../../components/atom/item.vue';
export default {
  meta: {
    size: 'middle',
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
