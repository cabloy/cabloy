export default {
  render() {
    const buttons = [];
    buttons.push(
      <eb-link
        key="remove"
        iconF7="::remove"
        iconSize="16"
        propsOnPerform={() => this.onWidgetDelete(this.widget)}
      ></eb-link>
    );
    buttons.push(
      <eb-link
        key="settings"
        iconF7="::settings"
        iconSize="16"
        propsOnPerform={() => this.onWidgetProperties(this.widget)}
      ></eb-link>
    );
    const directives = [
      {
        name: 'eb-dragdrop',
        value: {
          scene: this.dragdropScene,
          widgetId: this.widget.id,
          onDragStart: this.onDragStart,
          onDragElement: this.onDragElement,
          onDropElement: this.onDropElement,
          onDropLeave: this.onDropLeave,
          onDropEnter: this.onDropEnter,
          onDragEnd: this.onDragEnd,
          onDragDone: this.onDragDone,
        },
      },
    ];
    buttons.push(<eb-link key="open_with" iconF7="::open-with" iconSize="16" {...{ directives }}></eb-link>);
    return <div>{buttons}</div>;
  },
  props: {
    widget: {
      type: Object,
    },
    dragdropScene: {
      type: String,
    },
    onDragStart: {
      type: Function,
    },
    onDragElement: {
      type: Function,
    },
    onDropElement: {
      type: Function,
    },
    onDropLeave: {
      type: Function,
    },
    onDropEnter: {
      type: Function,
    },
    onDragEnd: {
      type: Function,
    },
    onDragDone: {
      type: Function,
    },
    onWidgetDelete: {
      type: Function,
    },
    onWidgetProperties: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
