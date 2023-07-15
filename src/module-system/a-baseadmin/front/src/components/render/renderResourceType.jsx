export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    atomClass() {
      const { parcel } = this.context;
      return {
        module: parcel.data.moduleTarget,
        atomClassName: parcel.data.atomClassNameTarget,
      };
    },
  },
  watch: {
    atomClass() {
      // clear value
      this.context.setValue(null);
    },
  },
  created() {},
  methods: {
    isResourceGeneral() {
      return this.atomClass && this.atomClass.module === 'a-base' && this.atomClass.atomClassName === 'resource';
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    if (!this.isResourceGeneral()) return null;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'resourceType',
      ebTitle: 'Resource Type',
      ebOptionsBlankAuto: true,
      ebRender: null,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
