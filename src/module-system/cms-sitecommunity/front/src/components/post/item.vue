<template>
  <div>
    <template v-if="!this.readOnly">
      <item-edit :readOnly="readOnly" :item="data" :onSave="onSave"></item-edit>
    </template>
    <template v-else>
      <item-view :readOnly="readOnly" :item="data"></item-view>
    </template>
  </div>
</template>
<script>
import itemEdit from './itemEdit.vue';
import itemView from './itemView.vue';
export default {
  meta: {
    global: false,
  },
  components: {
    itemEdit,
    itemView,
  },
  props: {
    // mode: edit/view
    readOnly: {
      type: Boolean,
    },
    data: {
      type: Object,
    },
    onSave: {
      type: Function,
    },
  },
};

</script>
<style scoped>


</style>
