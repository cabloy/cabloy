import Vue from 'vue';
import widgetGroup from '../components/widgetGroup.vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

export default {
  meta: {
    size: 'large',
  },
  mixins: [ebPageContext],
  components: {
    widgetGroup,
  },
  render() {
    let domNavbar;
    const domActions = this.renderActions();
    const showNavbar = this.scene === 'manager' || this.$meta.vueApp.layout === 'mobile' || this.$view.size === 'small';
    if (showNavbar) {
      const domActionsManager = this.renderActionsManager();
      domNavbar = (
        <eb-navbar title={this.page_title} ebBackLink="Back">
          <f7-nav-right>
            {domActionsManager}
            {domActions}
          </f7-nav-right>
        </eb-navbar>
      );
    }
    let domGroup;
    if (this.ready) {
      domGroup = <widget-group ref="group" root dashboard={this} widgets={this.profile.root.widgets}></widget-group>;
    }
    return (
      <eb-page ref="page" staticClass={`dashboard dashboard-profile-${this.dashboardAtomId} ${this.lock ? '' : 'dashboard-unlock'}`}>
        {domNavbar}
        {domGroup}
        {!showNavbar && <div class="dashboard-actions">{domActions}</div>}
      </eb-page>
    );
  },
  data() {
    const query = this.$f7route.query;
    const atomStaticKey = query.key;
    const dashboardAtomId = parseInt(query.atomId) || 0;
    const scene = query.scene;
    return {
      scene, // manager/others
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
      lock: true,
      page_dirty: false,
    };
  },
  computed: {
    page_title() {
      const title = this.title;
      if (!this.page_dirty) return title;
      return `* ${title}`;
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
    dashboardUsers() {
      return this.$local.state.dashboardUsers[this.dashboardAtomId];
    },
  },
  mounted() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('dashboard:destroy');
  },
  methods: {
    page_getDirty() {
      return this.page_dirty;
    },
    page_setDirty(dirty) {
      if (this.page_dirty === dirty) return;
      this.page_dirty = dirty;
      if (this.scene !== 'manager') {
        // not for manager
        this.$pageContainer.setPageDirty(dirty);
      }
    },
    __setTitle(title) {
      const titleBase = this.$text('Dashboard');
      if (!title) {
        title = titleBase;
      } else {
        // need not $text
        // title = this.$text(title);
        if (title === this.$text('Default')) {
          title = titleBase;
        }
      }
      this.title = title;
      // force set pageTitle, may be navbar rerendered
      this.$pageContainer.setPageTitle(this.page_title);
    },
    // actions: save/settings
    renderActionsManager() {
      if (!this.ready) return null;
      if (this.user.op.anonymous === 1) return null;
      if (this.scene !== 'manager') return null;
      const children = [];
      if (!this.lock) {
        children.push(<eb-link key="dashboard-action-save" class="dashboard-action-save" iconMaterial="save" propsOnPerform={event => this.onPerformSaveManager(event)}></eb-link>);
        children.push(<eb-link key="dashboard-action-settings" class="dashboard-action-settings" iconMaterial="settings" propsOnPerform={event => this.onPerformSettings(event)}></eb-link>);
      }
      return children;
    },
    // actions: lock/profile list
    // actions: unlock/save/settings
    renderActions() {
      if (!this.ready) return null;
      if (this.user.op.anonymous === 1) return null;
      if (this.scene === 'manager') return null;
      const children = [];
      if (this.lock) {
        children.push(<eb-link key="dashboard-action-lock" class="dashboard-action-lock" iconMaterial="lock" propsOnPerform={event => this.onPerformLock(event)}></eb-link>);
        if (this.dashboardUsers && this.dashboardUsers.length > 1) {
          children.push(
            <eb-link key="dashboard-action-profileSwitch" class="dashboard-action-profileSwitch" iconMaterial="view_list" propsOnPerform={event => this.onPerformProfileSwitch(event)}></eb-link>
          );
        }
      }
      if (!this.lock) {
        children.push(<eb-link key="dashboard-action-unlock" class="dashboard-action-unlock" iconMaterial="lock_open" propsOnPerform={event => this.onPerformUnlock(event)}></eb-link>);
        if (this.page_getDirty()) {
          children.push(<eb-link key="dashboard-action-save" class="dashboard-action-save" iconMaterial="save" propsOnPerform={event => this.onPerformSave(event)}></eb-link>);
        }
        children.push(<eb-link key="dashboard-action-settings" class="dashboard-action-settings" iconMaterial="settings" propsOnPerform={event => this.onPerformSettings(event)}></eb-link>);
      }
      return children;
    },
    async __init() {
      try {
        // check scene
        if (this.scene === 'manager') {
          // lock
          this.lock = this.readOnly;
        }
        // widgetsAll
        this.widgetsAll = await this.$store.dispatch('a/base/getResources', { resourceType: 'a-dashboard:widget' });
        // switch profile
        await this.__switchProfile({ dashboardUserId: this.dashboardUserId });
        // dashboardUsers
        if (this.scene !== 'manager') {
          await this.$local.dispatch('getDashboardUsers', {
            dashboardAtomId: this.dashboardAtomId,
          });
        }
        // ready
        this.ready = true;
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    __saveLayoutConfig() {
      this.page_setDirty(true);
      if (this.scene === 'manager' && !this.readOnly) {
        this.contextCallback(200, { content: JSON.stringify(this.profile) });
      }
    },
    __adjustDashboardKey(atomStaticKey) {
      const presets = this.$config.dashboard.presets;
      const dashboardConfig = this.user.op.anonymous ? presets.anonymous : presets.authenticated;
      if (!atomStaticKey || atomStaticKey === 'default') {
        return dashboardConfig.default;
      } else if (atomStaticKey === 'home') {
        return dashboardConfig.home;
      }
      return atomStaticKey;
    },
    async __switchProfile({ dashboardUserId }) {
      if (dashboardUserId === 0) {
        let title;
        if (this.scene === 'manager') {
          this.profile = JSON.parse(this.item.content);
          title = this.item.atomName;
        } else {
          const res = await this.$api.post('/a/dashboard/dashboard/itemByKey', {
            atomStaticKey: this.__adjustDashboardKey(this.atomStaticKey),
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
            title = this.dashboardSystem.atomNameLocale;
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
      // emit event
      this.$emit('dashboard:profileChange', this.dashboardUserId);
      // toast
      const toastText = `${this.$text('ProfileSwitchedPrompt')}: ${title}`;
      this.$view.toast.show({ text: toastText });
    },
    __checkProfile(profile) {
      // root id
      if (!profile.root.id) profile.root.id = this.$meta.util.uuidv4();
      // widget id
      for (const widget of profile.root.widgets) {
        this.__initWidget(widget, 'widget');
      }
      return profile;
    },
    __getProfileEmpty() {
      return {
        root: {
          id: this.$meta.util.uuidv4(),
          widgets: [],
        },
      };
    },
    __initWidget(widget, type) {
      // uuid
      if (!widget.id) {
        widget.id = this.$meta.util.uuidv4();
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
    async __createDashboardUser() {
      // create dashboardUser
      const dashboardUser = await this.$api.post('/a/dashboard/dashboard/createItemUser', {
        key: { atomId: this.dashboardAtomId },
      });
      // check if cache exists
      if (this.dashboardUsers) {
        this.dashboardUsers.push(dashboardUser);
      }
      // ok
      return dashboardUser.id;
    },
    async __saveDashboardUser() {
      // check if dirty
      if (!this.page_getDirty()) return;
      // save dashboardUser
      await this.$api.post('/a/dashboard/dashboard/saveItemUser', {
        dashboardUserId: this.dashboardUserId,
        content: JSON.stringify(this.profile),
      });
      this.page_setDirty(false);
      return this.$text('Saved');
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
      // // toast
      // this.$view.toast.show({ text: this.$text('DashboardUnlockWarningSave') });
    },
    async onPerformUnlock() {
      // save
      const res = await this.onPerformSave();
      // lock
      this.lock = true;
      // ok
      return res;
    },
    async onPerformSave() {
      // save
      return await this.__saveDashboardUser();
    },
    async onPerformSaveManager() {
      // for manager
      await this.contextParams.onSave();
      this.page_setDirty(false);
      return this.$text('Saved');
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
    async onPerformProfileSwitch(event) {
      if (!this.dashboardUsers) return;
      // buttons
      const dashboardUserIdCurrent = this.dashboardUserId;
      const buttons = [];
      for (const item of this.dashboardUsers) {
        const iconName = dashboardUserIdCurrent === item.id ? 'done' : '';
        buttons.push({
          icon: `<i class="icon material-icons">${iconName}</i>`,
          text: item.dashboardName,
          disabled: dashboardUserIdCurrent === item.id,
          data: item,
        });
      }
      // choose
      const params = {
        forceToPopover: true,
        targetEl: event.target,
        buttons,
      };
      const button = await this.$view.actions.choose(params);
      // switch layout
      await this.__switchProfile({ dashboardUserId: button.data.id });
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
    __onWidgetRealReady(widgetId, widgetReal) {
      this.__onWidgetRealDestroy();
      this.widgetsReal.push({ widgetId, widgetReal });
    },
    __onWidgetRealDestroy(widgetId /* , widgetReal*/) {
      const [, index] = this.__findWidgetRealById(widgetId);
      if (index > -1) {
        this.widgetsReal.splice(index, 1);
      }
    },
    __findWidgetRealById(widgetId) {
      const index = this.widgetsReal.findIndex(item => item.widgetId === widgetId);
      if (index === -1) return [null, -1];
      return [this.widgetsReal[index], index];
    },
    __getWidgetRealById(widgetId) {
      const [widget] = this.__findWidgetRealById(widgetId);
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
