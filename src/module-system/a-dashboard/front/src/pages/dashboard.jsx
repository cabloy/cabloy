import widgetGroup from '../components/widgetGroup.vue';

export default {
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
    return {
      ready: false,
      widgetsAll: null,
      atomStaticKey,
      profile: null,
      dashboardAtomId: 0,
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
      if (!this.lock) {
        children.push(
          <eb-link key="dashboard-action-settings" class="dashboard-action-settings" iconMaterial="settings" propsOnPerform={event => this.onPerformSettings(event)}></eb-link>
        );
      }
      return (
        <div class="dashboard-settings">
          {children}
        </div>
      );
    },
    async __init() {
      // widgetsAll
      this.widgetsAll = await this.$store.dispatch('a/base/getWidgets');
      await this.__switchProfile({ dashboardUserId: this.dashboardUserId });
      // ready
      this.ready = true;
    },
    __saveLayoutConfig() {
      this.__setDirty(true);
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
        const res = await this.$api.post('/a/dashboard/dashboard/itemByKey', {
          atomStaticKey: this.atomStaticKey,
        });
        let title;
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
    __findWidgetStock(widget) {
      if (widget.group) return null;
      if (!this.widgetsAll) return null;
      const widgets = this.widgetsAll[widget.module];
      return widgets[widget.name];
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
    async onPerformLock() {
      // check if user
      if (this.dashboardUserId === 0) {
        // create dashboardUser
        const res = await this.$api.post('/a/dashboard/dashboard/createItemUser', {
          key: { atomId: this.dashboardAtomId },
        });
        const dashboardUserId = res.dashboardUserId;
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
  },
};

