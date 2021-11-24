<script>
import Vue from 'vue';
import validateCheck from '../common/validate/validateCheck.js';
const f7Input = Vue.options.components['f7-input'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-input',
  extends: f7Input,
  mixins: [validateCheck],
  mounted() {
    this.$nextTick(() => {
      this.checkEmptyState();
    });
  },
  methods: {
    onValidateError(error) {
      const input = this._findInputTextElement();
      input[0].setCustomValidity(error);
      input[0].ebCustomError = error;
      this.$f7.input.validate(input);
      this.checkEmptyState();
    },
    onInput(event) {
      this.$emit('input', event.target.value);
      this._clearValidateError_input();
    },
    onChange(event) {
      this.$emit('change', event.target.value);
      this._clearValidateError_input();
    },
    onInputClear(event) {
      this.$emit('input:clear', event.target.value);
    },
    checkEmptyState() {
      this.$f7.input.checkEmptyState(this._findInputTextElement());
    },
  },
};
</script>
<style scoped></style>
