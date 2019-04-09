<template>
  <f7-list>
    <eb-list-item-validate dataKey="atomName"></eb-list-item-validate>
    <eb-list-item-validate dataKey="description"></eb-list-item-validate>
  </f7-list>
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
  methods: {},
};

</script>
<style scoped>
</style>
