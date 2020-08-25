<template>
  <eb-list-input type="textarea" :input="false" dataPath="context.dataPath" :label="$text('Metto')">
    <textarea slot="root" type="textarea" :value="context.getValue()" @input="onInput" class="json-textarea" :style="{height}" :placeholder="$text('Metto')"></textarea>
  </eb-list-input>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    context: {
      type: Object,
    },
    height: {
      type: String,
    },
  },
  created() {
    console.log(this.context.value);
  },
  methods: {
    onInput(event) {
      this.context.setValue(event.target.value);
    },
  },
};

</script>
<style scoped>
</style>
