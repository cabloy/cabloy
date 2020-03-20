<script>
export default {
  render(c) {
    const children = [];
    if (!this.errorMessage && this.ready) {
      // props
      const props = {
        section: this, // for more extensible
      };
      children.push(c(this.layout._sectionFullName(this.options), {
        staticClass: 'section-inner',
        props,
        on: {
          'sectionReal:ready': this.__onSectionRealReady,
          'sectionReal:destroy': this.__onSectionRealDestroy,
        },
      }));
    } else if (this.errorMessage) {
      children.push(c('div', {
        staticClass: 'section-inner section-inner-error',
        domProps: { innerText: this.errorMessage },
      }));
    }
    return c('div', {
      staticClass: 'section',
      directives: [{
        name: 'eb-dragdrop',
        value: {
          scene: this.dragdropScene,
          section: this.options,
          onDragStart: this.onDragStart,
          onDropElement: this.onDropElement,
          onDragDone: this.onDragDone,
        }
      }],
    }, children);
  },
  props: {
    options: {
      type: Object,
    },
    dragdropScene: {
      type: String,
    }
  },
  data() {
    return {
      ready: false,
      errorMessage: null,
    };
  },
  computed: {
    layout() {
      return this.sidebar.layout;
    },
    sidebar() {
      return this.$parent.$parent;
    },
    sections() {
      return this.group.sections;
    },
    group() {
      return this.$parent;
    },
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('section:destroy');
  },
  methods: {
    __init() {
      this.$meta.module.use(this.options.module, module => {
        const fullName = this.layout._sectionFullName(this.options);
        let component = module.options.components[this.options.name];
        if (!component) {
          this.errorMessage = `${this.$text('Section Not Found')}: ${fullName}`;
          this.ready = false;
        } else {
          component = this.$meta.util.createComponentOptions(component);
          this.$options.components[fullName] = component;
          this.ready = true;
          this.errorMessage = null;
        }
      });
    },
    onDragStart({ $el, context, dragElement }) {
      const [section, sectionIndexDrag] = this.sidebar._getSectionAndIndex(context.section);
      const tooltip = this.__getSectionTitle(section);
      return { tooltip };
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const [sectionDrop, sectionIndexDrop] = this.sidebar._getSectionAndIndex(context.section);
      const [sectionDrag, sectionIndexDrag] = this.sidebar._getSectionAndIndex(dragContext.section);
      if (sectionIndexDrop === sectionIndexDrag || sectionIndexDrop == sectionIndexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = this.__getSectionTitle(sectionDrop);
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const sectionIndexDrag = this.sidebar._getSectionIndex(context.section);
      this.sections.splice(sectionIndexDrag, 1);
      const sectionIndexDrop = this.sidebar._getSectionIndex(dropContext.section);
      this.sections.splice(sectionIndexDrop, 0, context.section);
      // save
      this.layout.__saveLayoutConfig();
    },
    __getSectionTitle(section) {
      return section.titleLocale || this.$text(section.title) || section.name;
    },
    __onSectionRealReady(sectionReal) {
      const fullName = this.layout._sectionFullName(this.options);
      this.group.sectionsReal[fullName] = sectionReal;
    },
    __onSectionRealDestroy(widgetReal) {
      const fullName = this.layout._sectionFullName(this.options);
      delete this.group.sectionsReal[fullName];
    },
  }

}

</script>
