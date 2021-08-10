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
      const self = this;
      if (!this.userLabels) return;
      // choose
      const { property } = this.context;
      const optional = this.$meta.util.getProperty(property, 'ebParams.optional');
      return new Promise(resolve => {
        const hostEl = this.$view.getHostEl();
        const targetEl = event.target;
        const buttons = [];
        let resolved = false;
        function onButtonClick(labelId) {
          self.context.setValue(labelId);
          resolved = true;
          resolve(true);
        }
        // optional
        if (optional) {
          buttons.push({
            text: '',
            onClick: () => {
              onButtonClick(0);
            },
          });
        }
        //
        for (const labelId in this.userLabels) {
          const label = this.userLabels[labelId];
          buttons.push({
            color: label.color,
            text: label.text,
            onClick: () => {
              onButtonClick(labelId);
            },
          });
        }
        const actions = this.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            resolve(false);
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
    _renderAfterLabel() {
      const labelCurrent = this.getLabelCurrent();
      if (!labelCurrent) return null;
      return <f7-badge color={labelCurrent.color}>{labelCurrent.text}</f7-badge>;
    },
  },
  render() {
    const { dataPath, property, validate } = this.context;
    const title = this.context.getTitle();
    const domAfterLabel = this._renderAfterLabel();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={title}>
          <div slot="after">{domAfterLabel}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseLabel}>
        <div slot="after">{domAfterLabel}</div>
      </eb-list-item-choose>
    );
  },
};
