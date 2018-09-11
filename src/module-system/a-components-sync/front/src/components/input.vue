<script>
import Vue from 'vue';
import validate from '../common/validate.js';
const f7Input = Vue.options.components['f7-input'].extendOptions;
export default {
  name: 'eb-input',
  extends: f7Input,
  mixins: [ validate ],
  mounted() {
    this.$nextTick(() => {
      this.checkEmptyState();
    });
  },
  methods: {
    onValidateError(error) {
      const input = this.$$(this.$el).find('input');
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
      const tag = this.type === 'textarea' ? 'textarea' : 'input';
      this.$f7.input.checkEmptyState(this.$$(this.$el).find(tag));
    },
  },
};

</script>
<style scoped>


</style>
