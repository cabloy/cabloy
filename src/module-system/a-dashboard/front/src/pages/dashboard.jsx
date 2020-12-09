import Vue from 'vue';
import widgetGroup from '../components/widgetGroup.vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

export default {
  meta: {
    size: 'large',
  },
  mixins: [ ebPageContext ],
  components: {
    widgetGroup,
  },
  render() {
    let domNavbar;
    if (this.$meta.vueApp.layout === 'mobile' || this.$view.size === 'small') {
      domNavbar = (
        <eb-navbar large largeTransparent title={this.pageTitle} ebBackLink='Back'>
        </eb-navbar>
      );
    }
    let domGroup;
    if (this.ready) {
      domGroup = (
        <widget-group ref="group" root dashboard={this} widgets={this.profile.root.widgets}></widget-group>
      );
    }
    let domActions;
    if (this.ready) {
      domActions = this.renderActions();
    }
    return (
      <eb-page ref="page" staticClass={`dashboard dashboard-profile-${this.dashboardAtomId} ${this.lock ? '' : 'dashboard-unlock'}`}>
        {domNavbar}
        {domGroup}
        {domActions}
      </eb-page>
    );
  },
  data() {
    const query = this.$f7route.query;
    const atomStaticKey = query.key;
    const dashboardAtomId = parseInt(query.atomId) || 0;
    const scene = query.scene;
    return {
      scene,
      ready: false,
      widgetsAll: null,
      atomStaticKey,
      profile: null,
      dashboardAtomId,
      dashboardUserId: 0,
      dashboardSystem: null,
      dashboardUser: null,
      widgetsReal: [],
      title: null,
      dirty: false,
      lock: true,
    };
  },
  computed: {
    pageTitle() {
      return this.dirty ? `* ${this.title}` : this.title;
    },
    user() {
      return this.$store.state.auth.user;
    },
    // for edit/view
    readOnly() {
      return this.contextParams && this.contextParams.readOnly;
    },
    item() {
      return this.contextParams && this.contextParams.item;
    },
  },
  mounted() {
    this.__init().then(() => {}).catch(err => {
      this.$view.toast.show({ text: err.message });
    });
  },
  beforeDestroy() {
    this.$emit('dashboard:destroy');
  },
  methods: {
    renderActions() {
      if (this.user.op.anonymous === 1) return null;
      const children = [];
      // not manager
      if (this.scene !== 'manager') {
        if (this.lock) {
          children.push(
            <eb-link key="dashboard-action-lock" class="dashboard-action-lock" iconMaterial="lock" propsOnPerform={event => this.onPerformLock(event)}></eb-link>
          );
        }
        if (!this.lock) {
          children.push(
            <eb-link key="dashboard-action-unlock" class="dashboard-action-unlock" iconMaterial="lock_open" propsOnPerform={event => this.onPerformUnlock(event)}></eb-link>
          );
        }
      }
      // manager
      if (this.scene === 'manager') {
        if (!this.lock) {
          children.push(
            <eb-link key="dashboard-action-save" class="dashboard-action-save" iconMaterial="save" propsOnPerform={event => this.onPerformSave(event)}></eb-link>
          );
        }
      }
      //
      if (!this.lock) {
        children.push(
          <eb-link key="dashboard-action-settings" class="dashboard-action-settings" iconMaterial="settings" propsOnPerform={event => this.onPerformSettings(event)}></eb-link>
        );
      }
      return (
        <div class="dashboard-actions">
          {children}
        </div>
      );
    },
    async __init() {
      // check scene
      if (this.scene === 'manager') {
        this.lock = this.readOnly;
      }
      // widgetsAll
      this.widgetsAll = await this.$store.dispatch('a/base/getResources', { resourceType: 'a-dashboard:widget' });
      await this.__switchProfile({ dashboardUserId: this.dashboardUserId });
      // ready
      this.ready = true;
    },
    __saveLayoutConfig() {
      this.__setDirty(true);
      if (this.scene === 'manager' && !this.readOnly) {
        this.contextCallback(200, { content: JSON.stringify(this.profile) });
      }
    },
    __setTitle(title) {
      const titleBase = this.$text('Dashboard');
      if (!title) {
        title = titleBase;
      } else {
        title = this.$text(title);
        if (title === this.$text('Default')) {
          title = titleBase;
        }
      }
      this.title = title;
      this.__onTitleChange();
    },
    __setDirty(dirty) {
      this.dirty = dirty;
      this.__onTitleChange();
    },
    __onTitleChange() {
      this.$refs.page.setPageTitle(this.pageTitle);
    },
    async __switchProfile({ dashboardUserId }) {
      if (dashboardUserId === 0) {
        let title;
        if (this.scene === 'manager') {
          this.profile = JSON.parse(this.item.content);
          title = this.item.atomName;
        } else {
          const res = await this.$api.post('/a/dashboard/dashboard/itemByKey', {
            atomStaticKey: this.atomStaticKey,
          });
          if (res.dashboardUser) {
            this.dashboardUser = res.dashboardUser;
            this.dashboardAtomId = this.dashboardUser.dashboardAtomId;
            this.dashboardUserId = this.dashboardUser.id;
            this.profile = JSON.parse(this.dashboardUser.content);
            title = this.dashboardUser.dashboardName;
          }
          if (res.dashboardSystem) {
            this.dashboardSystem = res.dashboardSystem;
            this.dashboardAtomId = this.dashboardSystem.atomId;
            this.dashboardUserId = 0;
            this.profile = JSON.parse(this.dashboardSystem.content);
            title = this.dashboardSystem.atomName;
          }
        }
        this.__checkProfile(this.profile);
        this.__setTitle(title);
        return;
      }
      // profile of user
      const dashboardUser = await this.$api.post('/a/dashboard/dashboard/loadItemUser', {
        dashboardUserId,
      });
      if (!dashboardUser) throw new Error('Dashboard not found!');
      // data
      this.dashboardUser = dashboardUser;
      this.dashboardAtomId = this.dashboardUser.dashboardAtomId;
      this.dashboardUserId = this.dashboardUser.id;
      this.profile = JSON.parse(this.dashboardUser.content);
      const title = this.dashboardUser.dashboardName;
      this.__checkProfile(this.profile);
      this.__setTitle(title);
    },
    __checkProfile(profile) {
      // root id
      if (!profile.root.id) profile.root.id = this.__generateUUID();
      // widget id
      for (const widget of profile.root.widgets) {
        this.__initWidget(widget, 'widget');
      }
      return profile;
    },
    __getProfileEmpty() {
      return {
        root: {
          id: this.__generateUUID(),
          widgets: [],
        },
      };
    },
    __initWidget(widget, type) {
      // uuid
      if (!widget.id) {
        widget.id = this.__generateUUID();
      }
      // properties
      if (!widget.properties) {
        widget.properties = this.$meta.util.extend({}, this.$config.profile.meta[type].properties);
      }
    },
    __findResourceStock(resourcesAll, resource) {
      if (!resourcesAll) return null;
      const _resource = resourcesAll[this.__resourceFullName(resource)];
      if (!_resource) return null;
      return {
        ...resource,
        title: _resource.atomName,
        titleLocale: _resource.atomNameLocale,
        resourceAtomId: _resource.atomId,
        resourceConfig: JSON.parse(_resource.resourceConfig),
      };
    },
    __findWidgetStock(widget) {
      if (widget.group) return null;
      return this.__findResourceStock(this.widgetsAll, widget);
    },
    async __saveDashboardUser() {
      // check if dirty
      if (this.dirty) {
        // save dashboardUser
        await this.$api.post('/a/dashboard/dashboard/saveItemUser', {
          dashboardUserId: this.dashboardUserId,
          content: JSON.stringify(this.profile),
        });
        this.__setDirty(false);
      }
    },
    async __createDashboardUser() {
      // create dashboardUser
      const res = await this.$api.post('/a/dashboard/dashboard/createItemUser', {
        key: { atomId: this.dashboardAtomId },
      });
      return res.dashboardUserId;
    },
    async onPerformLock() {
      // check if user
      if (this.dashboardUserId === 0) {
        // create dashboardUser
        const dashboardUserId = await this.__createDashboardUser();
        await this.__switchProfile({ dashboardUserId });
      }
      // open lock
      this.lock = false;
    },
    async onPerformUnlock() {
      // save
      await this.__saveDashboardUser();
      // lock
      this.lock = true;
    },
    onPerformSettings() {
      this.$view.navigate(`/a/dashboard/dashboard/settings?dashboardUserId=${this.dashboardUserId}`, {
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'profile', title: 'Profile2' },
        context: {
          params: {
            dashboard: this,
          },
        },
      });
    },
    async onPerformSave() {
      // for manager
      await this.contextParams.ctx.save();
      this.__setDirty(false);
      return this.$text('Saved');
    },
    onWidgetsAdd({ widgets }) {
      for (const widget of widgets) {
        this.$refs.group.onWidgetAdd(widget);
      }
    },
    onGroupAdd() {
      const widgetGroup = {
        group: true,
        widgets: [],
      };
      this.__initWidget(widgetGroup, 'widget');
      this.profile.root.widgets.push(widgetGroup);
      // save
      this.__saveLayoutConfig();
    },
    __generateUUID() {
      let d = new Date().getTime();
      if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now(); // use high-precision timer if available
      }
      const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    __onWidgetRealReady(widgetId, widgetReal) {
      this.__onWidgetRealDestroy();
      this.widgetsReal.push({ widgetId, widgetReal });
    },
    __onWidgetRealDestroy(widgetId, widgetReal) {
      const [ widget, index ] = this.__findWidgetRealById(widgetId);
      if (index > -1) {
        this.widgetsReal.splice(index, 1);
      }
    },
    __findWidgetRealById(widgetId) {
      const index = this.widgetsReal.findIndex(item => item.widgetId === widgetId);
      if (index === -1) return [ null, -1 ];
      return [ this.widgetsReal[index], index ];
    },
    __getWidgetRealById(widgetId) {
      const [ widget ] = this.__findWidgetRealById(widgetId);
      if (!widget) return null;
      return widget.widgetReal;
    },
    __resourceFullName(resource) {
      if (resource.atomStaticKey) return resource.atomStaticKey;
      return `${resource.module}:${resource.name}`;
    },
    onPerformAddWidget(ctx, widgetGroup) {
      ctx.$view.navigate('/a/basefront/resource/select?resourceType=a-dashboard:widget', {
        target: '_self',
        context: {
          params: {
            multiple: true,
          },
          callback: (code, nodes) => {
            if (code === 200) {
              if (nodes) {
                const widgets = nodes.map(item => {
                  return {
                    atomStaticKey: item.data.atomStaticKey,
                  };
                });
                widgetGroup.onWidgetsAdd({ widgets });
              }
            }
          },
        },
      });
    },
  },
};

