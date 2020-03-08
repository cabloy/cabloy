<script>
import Vue from 'vue';
export default {
  render(c) {
    const buttons = [];
    buttons.push(c('f7-link', {
      attrs: {
        iconMaterial: 'remove',
      },
    }));
    buttons.push(c('f7-link', {
      attrs: {
        iconMaterial: 'settings',
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
      staticClass: 'widget-toolbar-inner',
    }, buttons);
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
  },
  data() {
    return {}
  },
  methods: {}
}

</script>
