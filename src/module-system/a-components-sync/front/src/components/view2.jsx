import Vue from 'vue';
import ViewAppMethods from '../common/view/viewAppMethods.js';
import ViewDirty from '../common/view/viewDirty.js';
import ViewHost from '../common/view/viewHost.js';
import ViewModal from '../common/view/viewModal.js';
import ViewSize from '../common/view/viewSize.js';
const f7View = Vue.options.components['f7-view'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-view',
  mixins: [ViewAppMethods, ViewDirty, ViewHost, ViewModal, ViewSize],
  extends: f7View,
  mounted() {
    const self = this;
    const el = self.$refs.el;
    self.$f7ready(f7Instance => {
      if (self.props.init) return;
      self.routerData.instance = f7Instance.views.create(
        el,
        Object.assign(
          {
            on: {
              init: self.onViewInit,
            },
          },
          noUndefinedProps(self.$options.propsData || {})
        )
      );
      self.f7View = self.routerData.instance;
      self.f7View.on('swipebackMove', self.onSwipeBackMove);
      self.f7View.on('swipebackBeforeChange', self.onSwipeBackBeforeChange);
      self.f7View.on('swipebackAfterChange', self.onSwipeBackAfterChange);
      self.f7View.on('swipebackBeforeReset', self.onSwipeBackBeforeReset);
      self.f7View.on('swipebackAfterReset', self.onSwipeBackAfterReset);
      // viewReady
      this.$emit('view:ready', self);
    });
  },
  beforeDestroy() {
    const self = this;
    self.$emit('view:destroy', self);
  },
  render() {
    const _h = this.$createElement;
    const self = this;
    const props = self.props;
    const { id, style, tab, main, tabActive, className } = props;
    const classes = this.$vuef7.utils.classNames(
      className,
      'view',
      {
        'view-main': main,
        'tab-active': tabActive,
        tab,
      },
      this.$vuef7.mixins.colorClasses(props)
    );
    const domPages = self.state.pages.map(page => {
      const PageComponent = page.component;
      return _h(PageComponent, {
        key: page.id,
        props: page.props,
      });
    });
    const domModals = self._renderModals(_h);
    return _h(
      'div',
      {
        ref: 'el',
        style,
        class: classes,
        attrs: {
          id,
        },
      },
      [this.$slots.default, domPages, domModals]
    );
  },
};

function noUndefinedProps(obj) {
  const o = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') o[key] = obj[key];
  });
  return o;
}
