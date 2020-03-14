<script>
import Vue from 'vue';
const f7Toggle = Vue.options.components['f7-toggle'].extendOptions;
delete f7Toggle.props.checked;
delete f7Toggle.props.value;
export default {
  meta: {
    global: true,
  },
  name: 'eb-toggle',
  extends: f7Toggle,
  props: {
    value: {
      type: [Boolean, Number],
      default: false,
    },
  },
  data() {
    return {
      checked: this.value,
    };
  },
  watch: {
    value() {
      this.checked = this.value;
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
