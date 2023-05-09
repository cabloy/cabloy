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
    atomClassIdTarget() {
      return this.context.getValue('atomClassIdTarget');
    },
    atomMain() {
      const { validate } = this.context;
      return validate.host.atomMain;
    },
  },
  watch: {
    atomClassIdTarget: {
      handler(newValue) {
        this.__atomClassIdTargetChanged(newValue);
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    async __atomClassIdTargetChanged(atomClassId) {},
  },
  render() {
    const { dataPath, property, validate } = this.context;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{this.atomClassTitle}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseAtomClass}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{this.atomClassTitle}</div>
      </eb-list-item-choose>
    );
  },
};
