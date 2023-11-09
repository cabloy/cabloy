export default {
  methods: {
    __getConfigProp({ prop }) {
      const value = this.validate.host && this.validate.host[prop];
      // maybe disabled
      if (value === false || value === null) return value;
      // default
      const valueDefault = this.$config.validate[prop];
      if (value === undefined) return valueDefault;
      return this.$meta.util.extend({}, valueDefault, value);
    },
    __getConfigHint() {
      return this.__getConfigProp({ prop: 'hint' });
    },
    __getConfigCascadeParams() {
      return this.__getConfigProp({ prop: 'cascadeParams' });
    },
  },
};
