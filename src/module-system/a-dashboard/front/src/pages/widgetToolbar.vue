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
          scene: this.dashboard.dragdropScene,
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
    }
  },
  data() {
    return {
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    }
  },
  computed: {
    dashboard() {
      return this.$parent;
    },
  },
  methods: {
    onDragStart({ $el, context, dragElement }) {},
    onDragElement({ $el, context }) {},
    onDropElement({ $el, context, dragElement, dragConext }) {
      const panelIndexDrop = this.sidebar._getPanelIndex(context.panel);
      const panelIndexDrag = this.sidebar._getPanelIndex(dragConext.panel);
      if (panelIndexDrop === panelIndexDrag || panelIndexDrop == panelIndexDrag + 1) return null;
      return $el;
    },
    onDropLeave({ $el, context, dropElement }) {},
    onDropEnter({ $el, context, dropElement }) {},
    onDragEnd({ $el, context, dragElement }) {},
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const panelIndexDrag = this.sidebar._getPanelIndex(context.panel);
      this.panels.splice(panelIndexDrag, 1);
      const panelIndexDrop = this.sidebar._getPanelIndex(dropContext.panel);
      this.panels.splice(panelIndexDrop, 0, context.panel);
      // save
      this.layout.__saveLayoutConfig();
    },
  }
}

</script>
