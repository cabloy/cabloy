<template>
  <eb-search-page :title="$text('Search user')">
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
