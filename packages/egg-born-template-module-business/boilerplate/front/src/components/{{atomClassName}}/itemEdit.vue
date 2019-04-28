<template>
  <eb-list form no-hairlines-md @submit="onSubmit">
    <eb-list-item-validate dataKey="atomName"></eb-list-item-validate>
    <eb-list-item-validate dataKey="description"></eb-list-item-validate>
  </eb-list>
</template>
<script>
export default {
  props: {
    readOnly: {
      type: Boolean,
    },
    item: {
      type: Object,
    },
    onSave: {
      type: Function,
    },
  },
  methods: {
    onSubmit(event) {
      this.$emit('submit', event);
    },
  },
};

</script>
<style scoped>
</style>
