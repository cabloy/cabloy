<script>
import Vue from 'vue';
const f7Radio = Vue.options.components['f7-radio'].extendOptions;
export default {
  name: 'eb-radio',
  extends: f7Radio,
  methods: {
    onChange(event) {
      this.$emit('input', event.target.value);
    },
  },
};

</script>
<style scoped>


</style>
