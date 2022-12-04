import TabViews from './tabViews.vue';
import Group from './group.vue';
import MixinApp from '../common/layout/app.js';

export default {
  meta: {
    global: false,
  },
  mixins: [MixinApp],
  components: {
    ebTabViews: TabViews,
    ebGroup: Group,
  },
  data() {
    return {
      started: false,
      toolbarInited: false,
      tabShowed: false,
      sizeExtent: null,
      size: null,
      layoutDefault: null,
      layoutScene: null,
      layoutConfig: null,
      buttonsAll: null,
      layoutAtomStaticKey: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.__saveLayoutConfig = this.$meta.util.debounce(() => {
      this.__saveLayoutConfigNow();
    }, 1000);
  },
  beforeDestroy() {
    this.started = false;
    this.$meta.vueApp.clearLayoutInstance(this);
  },
  mounted() {
    this.$meta.vueApp.setLayoutInstance(this);
    this.$f7ready(() => {
      this.__init().then(() => {
        this.$nextTick(() => {
          // start
          this.start();
        });
      });
    });
  },
  methods: {
    onResize() {
      if (!this.started) return;
      this.setSize();
    },
    setSize() {
      const width = this.$$(this.$el).width();
      const height = this.$$(this.$el).height();

      // sizeExtent
      this.sizeExtent = { width, height };

      // size
      if (width <= this.layoutConfig.size.small * 2) {
        this.size = 'small';
      } else if (width > this.layoutConfig.size.small * 3) {
        this.size = 'large';
      } else {
        this.size = 'medium';
      }
    },
    start() {
      const vueApp = this.$meta.vueApp;
      if (vueApp.getLayoutInstance() !== this) {
        // do nothing
        return;
      }
      // size
      this.setSize();
      // loginOnStart
      if (vueApp.checkIfNeedOpenLogin()) {
        // open view login
        this.openLogin();
      } else {
        const hashInit = vueApp.popupHashInit();
        if (hashInit) {
          this.navigate(hashInit);
        } else {
          if (!this._checkSpecialPath()) {
            this.openHome();
          }
        }
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    _checkSpecialPath() {
      const query = this.$utils.parseUrlQuery();
      const path = query && query.__to;
      if (!path) return false;
      if (path === 'mine') {
        this.openMine();
        return true;
      }
      return false;
    },
    openMine() {
      this.tabShowed = true;
      this.$meta.eventHub.$emit('appMine:open');
    },
    openHome() {
      this.tabShowed = true;
      this.$meta.eventHub.$emit('appHome:open');
    },
    // options:
    //  target: _self/_view/_group
    navigate(url, options) {
      const vueApp = this.$meta.vueApp;
      if (vueApp.getLayoutInstance() !== this) {
        // do nothing
        return;
      }
      // options
      options = options || {};
      const ctx = options.ctx;
      const target = options.target;
      const scene = options.scene;

      if (!url) return;
      // check if http
      if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
        if (target) {
          window.open(url, target);
        } else {
          location.assign(url);
        }
        return;
      }
      // check login
      if (!this._checkUrlLogin(url)) return;
      // options
      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        // view
        const $viewEl = ctx && ctx.$view && this.$$(ctx.$view.$el);
        // check if target===_view or in views
        if (
          !$viewEl ||
          target === '_popup' ||
          target === '_view' ||
          target === '_group' ||
          scene === 'sidebar' ||
          $viewEl.parents('.eb-layout-scene').length > 0
        ) {
          // in new view
          this.$refs.group.createView({ ctx, url }).then(res => {
            if (res) {
              if (res.options) {
                // options = this.$utils.extend({}, options, res.options);
                options = Object.assign({}, options, res.options);
              }
              res.view.f7View.router.navigate(url, options);
            }
          });
        } else {
          // in current view
          ctx.$view.f7View.router.navigate(url, options);
        }
      }
    },
    _checkUrlLogin(url) {
      // not open login again
      const urlLogin = this.$meta.vueApp._getUrlLogin();
      if (url.indexOf(urlLogin) !== 0) return true;
      // view url
      const views = this.$refs.group.views;
      if (views.length === 0) return true;
      const viewUrl = views[views.length - 1].url || '';
      if (viewUrl.indexOf(urlLogin) !== 0) return true;
      // not open login again
      return false;
    },
    openLogin(routeTo, options) {
      this.$meta.vueApp.openLogin(routeTo, options);
    },
    closeView(view) {
      this.$refs.group.closeView(view);
    },
    backLink(ctx) {
      let backLink = false;
      const routeDiff = this.$meta.util.viewRouterDid(ctx.$view) ? 2 : 1;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - routeDiff])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.eb-layout-view');
        if ($view.length > 0) backLink = true;
      }
      return backLink;
    },
    __getResourcesAll() {
      const resourceTypes = [{ name: 'button', var: 'buttonsAll' }];
      const promises = [];
      for (const resourceType of resourceTypes) {
        promises.push(
          this.$store
            .dispatch('a/base/getResources', { resourceType: `a-layoutmobile:${resourceType.name}` })
            .then(data => {
              this[resourceType.var] = data;
            })
        );
      }
      return Promise.all(promises);
    },
    __saveLayoutConfigNow() {
      // override
      const value = this.$meta.util.extend({}, this.layoutConfig);
      // remove dynamic resources
      this.__removeDynamicResources(value);
      // save
      if (this.layoutAtomStaticKey) {
        this.$store.commit('a/base/setLayoutConfigKey', {
          module: 'a-layoutmobile',
          key: `layout:${this.layoutAtomStaticKey}`,
          value,
        });
      }
    },
    __removeDynamicResource(resources) {
      for (let index = resources.length - 1; index >= 0; index--) {
        const resource = resources[index];
        if (!resource.atomStaticKey && !resource.module) {
          resources.splice(index, 1);
        } else {
          // resources[index] = resource;
          // resources[index] = resource.atomStaticKey
          //   ? { atomStaticKey: resource.atomStaticKey }
          //   : { module: resource.module, name: resource.name };
        }
      }
    },
    __removeDynamicResources(value) {
      const resources = value.toolbar.buttons;
      if (resources) {
        this.__removeDynamicResource(resources);
      }
    },
    async __initLayoutKey() {
      let appPresetConfig = await this.$store.dispatch('a/app/getPresetConfigCurrent');
      if (!appPresetConfig.layout) {
        appPresetConfig = await this.$store.dispatch('a/app/getPresetConfigDefault');
      }
      this.layoutAtomStaticKey = appPresetConfig.layout;
      return this.layoutAtomStaticKey;
    },
    async __init() {
      const layoutKey = await this.__initLayoutKey();
      // buttonsAll
      await this.__getResourcesAll();
      // layoutDefault
      this.layoutDefault = this.$config.layout.default;
      // layoutScene
      const _layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', { layoutKey });
      this.layoutScene = _layoutItem.content;
      // layoutConfig
      const res = await this.$store.dispatch('a/base/getLayoutConfig', 'a-layoutmobile');
      // init layoutConfig
      this.__initLayoutConfig(res[`layout:${layoutKey}`], _layoutItem.atomRevision);
      // init toolbar
      this.__initToolbar();
      // inited
      this.toolbarInited = true;
    },
    __initLayoutConfig(layoutConfig, atomRevision) {
      if (layoutConfig && layoutConfig.atomRevision === atomRevision) {
        this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene, layoutConfig);
      } else {
        this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene, { atomRevision });
      }
    },
    reset() {
      this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene);
      this.__saveLayoutConfigNow();
      this.$meta.vueApp.reload();
    },
    __initToolbar() {
      const buttons = this.layoutConfig.toolbar.buttons;
      if (buttons) {
        this.layoutConfig.toolbar.buttons = [];
        for (const button of buttons) {
          this.layoutConfig.toolbar.buttons.push(this._prepareButton(button));
        }
      }
    },
    _prepareButton(button) {
      // title
      if (button.title && !button.titleLocale) {
        button.titleLocale = this.$text(button.title);
      }
      // stock
      const buttonStock = this._findButtonStock(button);
      // extend
      return this.$meta.util.extend({}, buttonStock, button);
    },
    _findResourceStock(resourcesAll, resource) {
      if (!resourcesAll) return null;
      const _resource = resourcesAll[this._resourceFullName(resource)];
      if (!_resource) return null;
      return {
        ...resource,
        title: _resource.atomName,
        titleLocale: _resource.atomNameLocale,
        resourceAtomId: _resource.atomId,
        resourceConfig: JSON.parse(_resource.resourceConfig),
      };
    },
    _findButtonStock(button) {
      return this._findResourceStock(this.buttonsAll, button);
    },
    _combineViewSizeClass() {
      let sizeClass = '';
      switch (this.size) {
        case 'small':
          sizeClass = 'eb-view-size-small';
          break;
        case 'medium':
          sizeClass = 'eb-view-size-small eb-view-size-medium';
          break;
        case 'large':
          sizeClass = 'eb-view-size-small eb-view-size-medium eb-view-size-large';
          break;
        default:
          break;
      }
      return sizeClass;
    },
    _resourceFullName(resource) {
      if (resource.atomStaticKey) return resource.atomStaticKey;
      return `${resource.module}:${resource.name}`;
    },
    _buttonFullName(button) {
      return this._resourceFullName(button);
    },
    _findButton(button) {
      const _buttonIndex = this.layoutConfig.toolbar.buttons.findIndex(
        item => this._buttonFullName(item) === this._buttonFullName(button)
      );
      if (_buttonIndex === -1) return [null, -1];
      return [this.layoutConfig.toolbar.buttons[_buttonIndex], _buttonIndex];
    },
    closeButton(button) {
      const [, _buttonIndex] = this._findButton(button);
      if (_buttonIndex === -1) return;
      this.layoutConfig.toolbar.buttons.splice(_buttonIndex, 1);
      this.__saveLayoutConfig();
    },
    openButton(button) {
      const [, _buttonIndex] = this._findButton(button);
      if (_buttonIndex > -1) return;
      // prepare button
      button = this._prepareButton(button);
      this.layoutConfig.toolbar.buttons.push(button);
      this.__saveLayoutConfig();
    },
    onbeforeunload() {
      // check group
      const groupVue = this.$refs.group;
      let dirty = groupVue && groupVue._getGroupDirty();
      if (dirty) return true;
      // check tabViews
      const tabViewsVue = this.$refs.tabViews;
      dirty = tabViewsVue && tabViewsVue._getTabViewsDirty();
      if (dirty) return true;
      // default
      return false;
    },
  },
  render() {
    // tab views
    let domViews;
    if (this.tabShowed) {
      domViews = <eb-tab-views ref="tabViews" toolbarConfig={this.layoutConfig.toolbar}></eb-tab-views>;
    }

    // group
    const domGroup = <eb-group ref="group"></eb-group>;

    // ready
    return (
      <div class="eb-layout-container eb-layout-container-mobile">
        {domViews}
        {domGroup}
      </div>
    );
  },
};
