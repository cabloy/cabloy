<template>
  <div>
    <template v-if="this.mode==='edit'">
      <item-edit :mode="mode" :item="item" @save="onSave"></item-edit>
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
    mode: {
      type: String,
    },
    item: {
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
