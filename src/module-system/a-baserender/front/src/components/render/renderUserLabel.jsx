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
    userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    getLabel(value) {
      if (!this.userLabels) return null;
      return this.userLabels[value];
    },
    getLabelCurrent() {
      const value = this.context.getValue();
      return this.getLabel(value);
    },
    async onChooseLabel(event) {
      if (!this.userLabels) return;
      // choose
      const self = this;
      const { property } = this.context;
      const optional = this.$meta.util.getProperty(property, 'ebParams.optional');
      // buttons
      const buttons = [];
      // optional
      if (optional) {
        buttons.push({
          text: '',
          data: 0,
        });
      }
      // userLabels
      for (const labelId in this.userLabels) {
        const label = this.userLabels[labelId];
        buttons.push({
          color: label.color,
          text: label.text,
          data: parseInt(labelId),
        });
      }
      // choose
      const params = {
        targetEl: event.currentTarget,
        buttons,
      };
      const button = await this.$view.actions.choose(params);
      self.context.setValue(button.data);
      return true;
    },
    _renderAfterLabel() {
      const labelCurrent = this.getLabelCurrent();
      if (!labelCurrent) return null;
      return <f7-badge color={labelCurrent.color}>{labelCurrent.text}</f7-badge>;
    },
  },
  render() {
    const { dataPath, property, validate } = this.context;
    const domAfterLabel = this._renderAfterLabel();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{domAfterLabel}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseLabel}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{domAfterLabel}</div>
      </eb-list-item-choose>
    );
  },
};
