<template>
  <item :query="query" mode="view"></item>
</template>
<script>
import Vue from 'vue';
import item from '../../components/atom/item.vue';
export default {
  components: {
    item,
  },
  data() {
    return {
      query: this.$f7Route.query,
    };
  },
};

</script>
<style scoped>


</style>
