<script>
import widgetGroup from '../components/widgetGroup.vue';

import Vue from 'vue';
export default {
  meta: {
    title: 'Dashboard',
  },
  components: {
    widgetGroup,
  },
  render(c) {
    const children = [];
    if (this.ready) {
      // root group
      children.push(c('widget-group', {
        ref: 'group',
        props: {
          root: true,
          dashboard: this,
          widgets: this.profile.root.widgets,
        },
      }));
      // settings
      children.push(c('f7-link', {
        staticClass: 'dashboard-settings',
        attrs: {
          iconMaterial: 'settings'
        },
        on: {
          click: this.onClickSettings,
        }
      }));
    }
    return c('eb-page', {
      staticClass: `dashboard dashboard-profile-${this.profileId}`,
    }, children);
  },
  data() {
    return {
      ready: false,
      widgetsAll: null,
      profile: null,
      profileId: 0,
      widgetsReal: [],
    };
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('dashboard:destroy');
  },
  methods: {
    __init() {
      // widgetsAll
      this.$store.dispatch('a/base/getWidgets').then(widgets => {
        this.widgetsAll = widgets;
        // layoutConfig
        this.$store.dispatch('a/base/getLayoutConfig', 'a-dashboard').then(layoutConfig => {
          // profile id
          const profileId = layoutConfig.profileId || 0;
          this.__switchProfile(profileId).then(() => {
            // ready
            this.ready = true;
          });
        });
      });
    },
    __saveProfileId() {
      this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-dashboard', key: 'profileId', value: this.profileId });
    },
    __saveLayoutConfig: Vue.prototype.$meta.util.debounce(function() {
      // override
      let profileValue = this.$meta.util.extend({}, this.profile);
      // save
      if (this.profileId === 0) {
        // save
        this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-dashboard', key: 'profile', value: profileValue });
        this.__saveProfileId();
      } else {
        this.$api.post('profile/save', { profileId: this.profileId, profileValue }).then(() => {
          this.__saveProfileId();
        });
      }
    }, 1000),
    __onTitleChange(title) {
      this.$view.$emit('view:title', { title });
    },
    __switchProfile(profileId) {
      return new Promise((resolve, reject) => {
        // default
        if (profileId === 0) {
          this.$store.dispatch('a/base/getLayoutConfig', 'a-dashboard').then(layoutConfig => {
            let profile;
            if (layoutConfig.profile) {
              // default of user
              profile = this.$meta.util.extend({}, layoutConfig.profile);
            } else {
              // default
              profile = this.__getProfileDefault();
            }
            this.profile = profile;
            this.profileId = profileId;
            this.__onTitleChange(this.$text('Dashboard')); // default
            return resolve();
          }).catch(err => reject(err));
          return;
        }
        // profile of user
        this.$api.post('profile/item', { profileId }).then(data => {
          if (!data) throw new Error('Profile not found!');
          let profile;
          if (data.profileValue) {
            profile = JSON.parse(data.profileValue);
          } else {
            profile = this.__getProfileEmpty();
          }
          this.profile = profile;
          this.profileId = profileId;
          this.__onTitleChange(`${this.$text('Dashboard')}-${data.profileName}`);
          return resolve();
        }).catch(err => reject(err));
      });
    },
    __getProfileDefault() {
      const profileDefault = this.$config.profile.default;
      const profile = this.$meta.util.extend({}, profileDefault);
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
    onClickSettings() {
      this.$view.navigate(`/a/dashboard/dashboard/settings?profileId=${this.profileId}`, {
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
      var d = new Date().getTime();
      if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    __onWidgetRealReady(widgetId, widgetReal) {
      this.__onWidgetRealDestroy();
      this.widgetsReal.push({ widgetId, widgetReal });
    },
    __onWidgetRealDestroy(widgetId, widgetReal) {
      const [widget, index] = this.__findWidgetRealById(widgetId);
      if (index > -1) {
        this.widgetsReal.splice(index, 1);
      }
    },
    __findWidgetRealById(widgetId) {
      const index = this.widgetsReal.findIndex(item => item.widgetId === widgetId);
      if (index === -1) return [null, -1];
      return [this.widgetsReal[index], index];
    },
    _getPropsSchemaBasic(bGroup) {
      if (bGroup) return this.$config.schema.basic.group;
      return this.$config.schema.basic.widget;
    },
    _getPropsSchemaGeneral(widgetId) {
      const [widgetItem] = this.__findWidgetRealById(widgetId);
      const component = widgetItem.widgetReal.$options;
      return (component.meta && component.meta.widget && component.meta.widget.schema && component.meta.widget.schema.props) || null;
    },
  }
}

</script>
