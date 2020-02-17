<script>
import Vue from 'vue';
import validate from '../common/validate.js';
const f7ListInput = Vue.options.components['f7-list-input'].extendOptions;
export default {
  name: 'eb-list-input',
  extends: f7ListInput,
  mixins: [validate],
  mounted() {
    this.$nextTick(() => {
      this.checkEmptyState();
    });
  },
  methods: {
    onValidateError(error) {
      const input = this._findText();
      input[0].setCustomValidity(error);
      this.$f7.input.validate(input);
      this.checkEmptyState();
    },
    onInput(event) {
      this.$emit('input', event.target.value);
      this.clearValidateError();
    },
    onChange(event) {
      this.$emit('change', event.target.value);
    },
    onInputClear(event) {
      this.$emit('input:clear', event.target.value);
    },
    checkEmptyState() {
      this.$f7.input.checkEmptyState(this._findText());
    },
    _findText() {
      const tag = this.type === 'textarea' ? 'textarea' : 'input';
      return this.$$(this.$el).find(tag);
    },
  },
};

</script>
<style scoped>
</style>
