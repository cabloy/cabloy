export default {
  mounted() {
    this.$nextTick(() => {
      this.input_checkEmptyState();
    });
  },
  methods: {
    onValidateError(error) {
      const input = this.input_findTextElement();
      input[0].setCustomValidity(error);
      input[0].ebCustomError = error;
      this.$f7.input.validate(input);
      this.input_checkEmptyState();
    },
    onInput(event) {
      this.$emit('input', event.currentTarget.value);
      this.input_clearValidateError();
    },
    onChange(event) {
      this.$emit('change', event.currentTarget.value);
      this.input_clearValidateError();
    },
    onInputClear(event) {
      this.$emit('input:clear', event.currentTarget.value);
    },
    input_checkEmptyState() {
      this.$f7.input.checkEmptyState(this.input_findTextElement());
    },
    input_clearValidateError() {
      this.$nextTick(() => {
        const input = this.input_findTextElement();
        if (input[0]) {
          input[0].ebCustomError = null;
        }
        this.clearValidateError();
      });
    },
    input_findTextElement() {
      const tag = this.type === 'textarea' ? 'textarea' : 'input';
      return this.$$(this.$el).find(tag);
    },
  },
};
