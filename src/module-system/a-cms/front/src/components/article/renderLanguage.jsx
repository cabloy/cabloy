import Vue from 'vue';
const ebValidateCheck = Vue.prototype.$meta.module.get('a-components').options.mixins.ebValidateCheck;
export default {
  mixins: [ ebValidateCheck ],
  data() {
    return {
      errorMessage: null,
    };
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
    this.context.property.ebTypeDynamic = 'select';
  },
  methods: {
    getDataPath() {
      return this.context.dataPath;
    },
    onValidateError(error) {
      this.errorMessage = error;
    },
    onInput(event) {
      this.context.setValue(event.target.value);
      this.$emit('input', event.target.value);
      this.clearValidateError();
    },
  },
  render() {
    return <f7-list-item>d</f7-list-item>;
    return (
      <eb-list-item-validate dataKey="language" ebType="select"></eb-list-item-validate>
    );
  },
};
