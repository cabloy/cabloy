<script>
import Vue from 'vue';
import validate from '../common/validate.js';
const f7Input = Vue.options.components.f7Input;
export default {
  name: 'eb-input',
  extends: f7Input,
  mixins: [ validate ],
  mounted() {
    this.$nextTick(() => {
      this.$f7.input.checkEmptyState(this.$$(this.$el).find('input'));
    });
  },
  methods: {
    onValidateError(error) {
      const input = this.$$(this.$el).find('input');
      input[0].setCustomValidity(error);
      this.$f7.input.validate(input);
    },
    onInput(event) {
      this.$emit('input', event.target.value);
      this.clearValidateError();
    },
    onChange(event) {
      this.$emit('change', event.target.value);
    },
    onInputClear(event) {
      this.onInput(event);
      this.$emit('input:clear', event.target.value);
    },
  },
};

</script>
<style scoped>


</style>
