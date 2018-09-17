<template>
  <eb-search-page :title="$text('Search Menu')">
    <menus slot="list" mode="search"></menus>
  </eb-search-page>
</template>
<script>
import menus from '../../components/menu/list.vue';
export default {
  components: {
    menus,
  },
};

</script>
