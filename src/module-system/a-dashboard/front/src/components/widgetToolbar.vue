<script>
import Vue from 'vue';
export default {
  render(c) {
    const buttons = [];
    buttons.push(c('eb-link', {
      attrs: {
        iconMaterial: 'remove',
      },
      props: {
        onPerform: () => {
          this.onWidgetDelete(this.widget);
        },
      },
    }));
    buttons.push(c('f7-link', {
      attrs: {
        iconMaterial: 'settings',
      },
      on: {
        click: () => {
          this.onWidgetProperties(this.widget);
        },
      },
    }));
    buttons.push(c('f7-link', {
      attrs: {
        iconMaterial: 'open_with',
      },
      directives: [{
        name: 'eb-dragdrop',
        value: {
          scene: this.dragdropScene,
          widgetId: this.widget.id,
          onDragContainer: this.onDragContainer,
          onDragStart: this.onDragStart,
          onDragElement: this.onDragElement,
          onDropElement: this.onDropElement,
          onDropLeave: this.onDropLeave,
          onDropEnter: this.onDropEnter,
          onDragEnd: this.onDragEnd,
          onDragDone: this.onDragDone,
        }
      }],
    }));
    return c('div', {
      staticClass: '',
    }, buttons);
  },
  props: {
    widget: {
      type: Object,
    },
    dragdropScene: {
      type: String,
    },
    onDragContainer: {
      type: Function,
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
    return {}
  },
  methods: {}
}

</script>
