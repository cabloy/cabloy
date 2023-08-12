export default {
  state() {
    return {
      modes: [
        { title: 'AllowAllFieldsRead', value: 'allowAllFieldsRead' },
        { title: 'AllowAllFieldsReadWrite', value: 'allowAllFieldsReadWrite' },
        { title: 'AllowSpecificFields', value: 'allowSpecificFields' },
        { title: 'Custom', value: 'custom' },
      ],
    };
  },
  actions: {
    getModes() {
      return this.modes;
    },
    getMode({ value }) {
      value = value || 'allowAllFieldsRead';
      return this.modes.find(item => item.value === value);
    },
  },
};
