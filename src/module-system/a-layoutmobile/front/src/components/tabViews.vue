<script>
import Vue from 'vue';
import TabButton from './tabButton.vue';
export default {
  components: {
    ebTabButton: TabButton,
  },
  render(c) {
    // links and tabs
    const toolbarLinks = [];
    const tabs = [];
    for (const button of this.buttons) {
      const fullName = this.layout._buttonFullName(button);
      // tab id
      const id = `eb-layout-tab-${fullName}`;
      // link
      toolbarLinks.push(c('eb-tab-button', {
        key: fullName,
        props: {
          layout: this.layout,
          buttons: this.buttons,
          group: this,
          options: button,
          dragdropScene: this.dragdropScene,
        },
      }));
      // view
      const _viewAttrs = {
        id,
        name: fullName,
        tab: true,
        'data-url': button.resourceConfig.url,
        init: true,
        tabActive: button.active,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        'data-size': this.size,
      };
      tabs.push(c('eb-view', {
        key: id,
        staticClass: `eb-layout-tab ${this.layout._combineViewSizeClass()}`,
        attrs: _viewAttrs,
        props: {
          size: this.size,
          sizeExtent: this.sizeExtent,
        },
        on: { 'tab:show': this.onTabShow },
      }));
    }
    // toolbar
    const _toolbarAttrs = this.$utils.extend({}, this.toolbarConfig.meta);
    const toolbar = c('f7-toolbar', { attrs: _toolbarAttrs }, toolbarLinks);
    // views
    return c('f7-views', {
      staticClass: 'eb-layout-scene eb-layout-scene-tool',
      attrs: { tabs: true },
    }, [ toolbar, ...tabs ]);
  },
  props: {
    toolbarConfig: {
      type: Object,
    },
  },
  data() {
    return {
      buttonsReal: {},
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  computed: {
    layout() {
      return this.$parent;
    },
    size() {
      return this.$parent.size;
    },
    sizeExtent() {
      return this.$parent.sizeExtent;
    },
    buttons() {
      return this.toolbarConfig.buttons;
    },
  },
  mounted() {
    this.onTabShow();
  },
  methods: {
    onTabShow(el) {
      const target = el ? this.$$(el) : this.$$('.view.eb-layout-tab.tab-active');
      if (target.hasClass('eb-layout-tab')) {
        const path = target[0].f7View.router.currentRoute.path;
        if (!path || path === '/') {
          target[0].f7View.router.navigate(target.data('url'));
        }
      }
    },
    _getButtonIndex(button) {
      return this.buttons.findIndex(item => this.layout._buttonFullName(item) === this.layout._buttonFullName(button));
    },
    _getButtonAndIndex(button) {
      const buttonIndex = this._getButtonIndex(button);
      if (buttonIndex === -1) return [ null, -1 ];
      return [ this.buttons[buttonIndex], buttonIndex ];
    },
  },
};

</script>
<style scoped>
</style>
