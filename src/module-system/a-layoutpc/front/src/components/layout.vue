<script>
import Header from './header.vue';
import Groups from './groups.vue';

export default {
  meta: {
    global: false,
  },
  components: {
    ebHeader: Header,
    ebGroups: Groups,
  },
  render(c) {
    const header = c('eb-header', {
      ref: 'header',
      style: { height: `${this.size.top}px` },
    });
    const groups = c('eb-groups', {
      ref: 'groups',
      style: {
        height: `${this.size.height - this.size.top - this.size.spacing * 2}px`,
        top: `${this.size.spacing}px`,
      },
    });
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-pc' }, [ header, groups ]);
  },
  data() {
    return {
      started: false,
      size: {
        width: 0,
        height: 0,
        small: 0,
        middle: 0,
        large: 0,
        enough: false,
        top: 0,
        main: 0,
        spacing: 0,
      },
      groups: [],
      router: null,
    };
  },
  mounted() {
    this.$f7ready(() => {
      // start
      this.start();
    });
  },
  methods: {
    onResize() {
      if (!this.started) return;
      this.setSize();
      this.resizeGroups();
    },
    resizeGroups() {
      for (const group of this.groups) {
        this.$refs.groups.resizeGroup(group.id);
      }
    },
    setSize() {
      const width = this.size.width = this.$$(this.$el).width();
      const height = this.size.height = this.$$(this.$el).height();

      // spacing
      const spacing = this.size.spacing = this.$config.layout.size.spacing;

      // width
      const small = parseInt((width - spacing * 3) / 3);
      if (small < this.$config.layout.size.small) {
        this.size.small = parseInt((width - spacing * 2) / 2);
        this.size.enough = false;
      } else {
        this.size.small = small;
        this.size.enough = true;
      }
      this.size.middle = this.size.small * 2;
      if (this.size.enough) {
        this.size.large = this.size.small * 3 + spacing;
      } else {
        this.size.large = this.size.middle;
      }

      // height
      this.size.top = this.$config.layout.size.top;
      this.size.main = height - this.size.top - spacing * 2;
    },
    start() {
      // size
      this.setSize();
      // loginOnStart
      if (this.$config.layout.loginOnStart === true && !this.$store.state.auth.loggedIn) {
        // open view login
        this.openLogin();
      } else {
        // hash init
        const hashInit = this.$store.state.auth.hashInit;
        this.$store.commit('auth/setHashInit', null);
        // open view main
        if (hashInit && hashInit !== '/' && hashInit !== this.$config.layout.login) {
          this.navigate(hashInit);
        } else {
          this.openHome();
        }
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    openHome() {
      const button = this.$config.layout.header.buttons.find(button => button.name === 'Home');
      if (button) this.navigate(button.url, { target: '_dashboard' });
    },
    navigate(url, options) {
      options = options || {};
      const ctx = options.ctx;
      const target = options.target;
      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        // groupId
        let groupId;
        if (!ctx || !ctx.$view || target === '_group' || this.$$(ctx.$view.$el).parents('.eb-layout-group-dashboard').length > 0) {
          groupId = null;
        } else {
          groupId = this.$$(ctx.$view.$el).parents('.eb-layout-group').data('groupId');
        }
        // get view
        this.getView({ ctx, groupId, url, dashboard: target === '_dashboard' }).then(res => {
          if (res) {
            if (res.options) this.$utils.extend(options, res.options);
            res.view.f7View.router.navigate(url, options);
          }
        });
      }
    },
    getGroup({ id, url }) {
      if (id) return this.groups.find(group => group.id === id);
      return this.groups.find(group => group.url === url);
    },
    getView({ ctx, groupId, url, dashboard }) {
      return new Promise(resolve => {
        let group = this.getGroup({ id: groupId, url });
        if (!group) {
          groupId = this.$meta.util.nextId('layoutgroup');
          group = {
            id: groupId,
            url,
            title: '',
            dashboard,
            views: [],
          };
          if (dashboard) {
            this.groups.unshift(group);
          } else {
            this.groups.push(group);
          }
        }
        if (group.url === url && group.views.length > 0) {
          this.$f7.tab.show(`#${group.id}`);
          resolve(null);
        } else {
          let viewIndex = -1;
          if (ctx && ctx.$view) {
            viewIndex = parseInt(this.$$(ctx.$view.$el).data('index'));
            if (viewIndex >= group.views.length - 1) {
              viewIndex = -1;
            }
          }
          if (viewIndex === -1) {
            const viewId = this.$meta.util.nextId('layoutgroupview');
            group.views.push({
              id: viewId,
              url,
              size: 'small',
              sizeExtent: {
                width: this.size.small,
                height: this.size.main,
              },
              callback: ({ view, title }) => {
                // title
                if (title) group.title = title;
                this.$nextTick(() => {
                  this.$f7.tab.show(`#${group.id}`);
                  resolve({ view, options: null });
                });
              },
            });
          } else {
            // remove last views
            for (let i = group.views.length - 1; i >= 0; i--) {
              if (i > viewIndex + 1) {
                group.views.splice(i, 1);
              }
            }
            this.$refs.groups.reLayout(groupId);
            // return next view
            const view = this.$refs.groups.getView(group.id, group.views[viewIndex + 1].id);
            resolve({ view, options: { reloadAll: true } });
          }
        }
      });
    },
    removeGroup(groupId) {
      // current
      const index = this.groups.findIndex(group => group.id === groupId);
      const groupCurrent = this.groups[index];
      // next
      let groupIdNext;
      if (this.$refs.header.isTabActive(groupId)) {
        if (this.groups.length - 1 > index) {
          groupIdNext = this.groups[index + 1].id;
        } else if (index > 0) {
          groupIdNext = this.groups[index - 1].id;
        }
      }
      // remove
      this.groups.splice(index, 1);
      this.$nextTick(() => {
        // next
        if (groupIdNext) {
          this.$f7.tab.show(`#${groupIdNext}`);
        }
        // check if openHome
        if (this.groups.length === 0 && !groupCurrent.dashboard) {
          this.openHome();
        }
      });
    },
    openLogin(routeTo) {
      const hashInit = (!routeTo || typeof routeTo === 'string') ? routeTo : routeTo.url.url;
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      this.navigate(this.$config.layout.login);
    },
    hideView(view, cancel = false) {
      const viewIndex = parseInt(this.$$(view.$el).data('index'));
      const groupId = this.$$(view.$el).parents('.eb-layout-group').data('groupId');
      const group = this.getGroup({ id: groupId });
      for (let i = group.views.length - 1; i >= 0; i--) {
        if (i >= viewIndex) {
          group.views.splice(i, 1);
        }
      }
      if (group.views.length === 0) {
        this.removeGroup(groupId);
      } else {
        this.$refs.groups.reLayout(groupId);
      }
    },
    backLink(ctx) {
      let backLink = false;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - 1])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.view');
        if (parseInt($view.data('index')) > 0) backLink = true;
      }
      return backLink;
    },
  },
};

</script>
<style scoped>
</style>
