export default {
  data() {
    return {};
  },
  methods: {
    subnavbar_policyDefaultCalc_render() {
      return this.container.atomClass && this.container.scene !== 'select' && this.container.scene !== 'selecting';
    },
    subnavbar_policyDefaultCalc_enable() {
      return false;
    },
  },
};
