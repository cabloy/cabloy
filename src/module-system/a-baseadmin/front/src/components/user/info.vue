<template>
  <eb-validate ref="validate" auto readOnly :data="user" :params="{module:'a-base',validator: 'user'}">
  </eb-validate>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    user: {
      type: Object,
    }
  },
  data() {
    return {};
  },
};

</script>
