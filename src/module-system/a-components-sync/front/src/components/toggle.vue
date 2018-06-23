<script>
import Vue from 'vue';
const f7Toggle = Vue.options.components.f7Toggle;
delete f7Toggle.props.checked;
export default {
  name: 'eb-toggle',
  extends: f7Toggle,
  props: {
    value: {
      type: [Boolean, Number],
      default: false,
    },
  },
  computed: {
    checked() {
      return this.value;
    },
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.checked);
    },
  },
};

</script>
<style scoped>


</style>
