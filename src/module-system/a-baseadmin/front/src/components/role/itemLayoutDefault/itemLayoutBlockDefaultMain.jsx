export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    roleAtomId() {
      return this.layoutManager.container.atomId;
    },
  },
  created() {},
  methods: {
    _renderToolbar() {
      if (!this.roleActions) return null;
      const children = [];
      for (const action of this.roleActions) {
        children.push(
          <eb-button
            key={action.name}
            outline
            iconF7={action.icon.f7}
            propsOnPerform={event => this.onPerformAction(event, action)}
          >
            {action.titleLocale}
          </eb-button>
        );
      }
      if (children.length === 0) return null;
      return <f7-segmented tag="p">{children}</f7-segmented>;
    },
  },
  onPerformAction(event, action) {
    const method = `onPerformAction_${action.name}`;
    return this[method](event, action);
  },
  onPerformAction_addChildRole(event, action) {},
  render() {
    const domToolbar = this._renderToolbar();
    const domValidate = this.layoutManager.validate_render();
    if (!domToolbar) return domValidate;
    return (
      <div>
        {domToolbar}
        {domValidate}
      </div>
    );
  },
};
