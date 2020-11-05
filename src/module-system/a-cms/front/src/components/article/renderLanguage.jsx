import Vue from 'vue';
const ebValidateCheck = Vue.prototype.$meta.module.get('a-components').options.mixins.ebValidateCheck;
export default {
  mixins: [ ebValidateCheck ],
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    atomClass() {
      return {
        module: this.context.data.module,
        atomClassName: this.context.data.atomClassName,
      };
    },
    languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    }).then(res => {
      if (res.length === 1) {
        this.context.data.language = res[0].value;
      }
    });
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
    const property = this.$utils.extend({}, this.context.property, {
      ebType: 'select',
    });
    return (
      <eb-list-item-validate dataKey="language" property={property} meta={{ options: this.languages }}></eb-list-item-validate>
    );
  },
};
