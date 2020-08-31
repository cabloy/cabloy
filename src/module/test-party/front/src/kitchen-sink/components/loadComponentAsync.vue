<template>
  <f7-block strong>
    <slot name="scoped" :user="user"></slot>
    <slot name="named"></slot>
    <slot></slot>
  </f7-block>
</template>
<script>
export default {
  data() {
    return {
      user: {
        name: 'zhennann',
      },
    };
  },
  created() {},
};

</script>
<style scoped>
</style>
