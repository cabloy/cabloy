<template>
  <eb-search-page :title="$text('Search User')">
    <users slot="list"></users>
  </eb-search-page>
</template>
<script>
import users from '../../components/user/list.vue';
export default {
  components: {
    users,
  },
};

</script>
