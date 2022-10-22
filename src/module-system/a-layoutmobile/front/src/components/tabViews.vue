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
      // tabview id
      const id = this._getViewId(button);
      // link
      toolbarLinks.push(
        c('eb-tab-button', {
          key: fullName,
          ref: fullName,
          props: {
            layout: this.layout,
            group: this,
            options: button,
            dragdropScene: this.dragdropScene,
          },
        })
      );
      // view
      const url = button.resourceConfig && button.resourceConfig.url;
      const _viewAttrs = {
        id,
        name: fullName,
        tab: true,
        'data-url': url,
        init: true,
        tabActive: fullName === this.buttonActiveFullName,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        'data-size': this.size,
      };
      tabs.push(
        c('eb-view', {
          key: id,
          ref: id,
          staticClass: `eb-layout-tab ${this.layout._combineViewSizeClass()}`,
          attrs: _viewAttrs,
          props: {
            size: this.size,
            sizeExtent: this.sizeExtent,
          },
          on: { 'tab:show': this.onTabShow },
        })
      );
    }
    // toolbar
    // const _toolbarAttrs = this.$utils.extend({}, this.toolbarConfig.meta);
    const _toolbarAttrs = Object.assign({}, this.toolbarConfig.meta);
    const toolbar = c(
      'f7-toolbar',
      {
        staticClass: 'tab-buttons',
        attrs: _toolbarAttrs,
      },
      toolbarLinks
    );
    // views
    return c(
      'f7-views',
      {
        staticClass: 'eb-layout-scene eb-layout-scene-tool',
        attrs: { tabs: true },
      },
      [toolbar, ...tabs]
    );
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
    buttonActive() {
      if (!this.toolbarConfig.buttonActive) return this.buttons[0];
      const [button] = this._getButtonAndIndex({ atomStaticKey: this.toolbarConfig.buttonActive });
      if (button) return button;
      return this.buttons[0];
    },
    buttonActiveFullName() {
      return this.buttonActive ? this.layout._buttonFullName(this.buttonActive) : '';
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
        const fullName = target[0].f7View.name;
        // check if firse show
        if (!path || path === '/') {
          const url = target.data('url');
          if (url) {
            target[0].f7View.router.navigate(url);
          } else {
            this._raiseViewInit(fullName);
          }
        }
        // active
        if (this.buttonActiveFullName !== fullName) {
          // eslint-disable-next-line
          this.toolbarConfig.buttonActive = fullName;
          this.layout.__saveLayoutConfig();
        }
      }
    },
    _raiseViewInit(fullName) {
      const buttonInstance = this.$refs[fullName] && this.$refs[fullName].getButtonInstance();
      if (!buttonInstance) {
        window.setTimeout(() => {
          this._raiseViewInit(fullName);
        }, 50);
        return;
      }
      buttonInstance.onViewInit();
    },
    _getButtonIndex(button) {
      return this.buttons.findIndex(item => this.layout._buttonFullName(item) === this.layout._buttonFullName(button));
    },
    _getButtonAndIndex(button) {
      const buttonIndex = this._getButtonIndex(button);
      if (buttonIndex === -1) return [null, -1];
      return [this.buttons[buttonIndex], buttonIndex];
    },
    _getViewId(button) {
      const fullName = this.layout._buttonFullName(button);
      return `eb-layout-tab-${fullName.replace(':', '_')}`;
    },
    _getTabViewsDirty() {
      for (const button of this.buttons) {
        const viewId = this._getViewId(button);
        const viewVue = this.$refs[viewId];
        const dirty = viewVue && viewVue.getViewDirty && viewVue.getViewDirty();
        if (dirty) return true;
      }
      return false;
    },
  },
};
</script>
<style scoped></style>
