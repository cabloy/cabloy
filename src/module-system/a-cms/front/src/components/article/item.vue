<template>
  <div>
    <template v-if="!this.readOnly">
      <item-edit :readOnly="readOnly" :item="data" @save="onSave"></item-edit>
    </template>
    <template v-else></template>
  </div>
</template>
<script>
import itemEdit from './itemEdit.vue';
export default {
  meta: {
    global: false,
  },
  components: {
    itemEdit,
  },
  props: {
    // mode: edit/view
    readOnly: {
      type: Boolean,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onSave() {
      this.$emit('save');
    },
  },
};

</script>
<style scoped>


</style>
