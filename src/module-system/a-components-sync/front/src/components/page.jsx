import Vue from 'vue';
const f7Page = Vue.options.components['f7-page'].extendOptions;
delete f7Page.props.hideNavbarOnScroll;
delete f7Page.props.hideToolbarOnScroll;
delete f7Page.props.className;
const __prefix = '* ';
export default {
  meta: {
    global: true,
  },
  name: 'eb-page',
  extends: f7Page,
  props: {
    ebHideNavbarOnScroll: {},
    ebHideToolbarOnScroll: {},
    ebClassName: {},
  },
  data() {
    return {
      pageTitle: null,
      pageDirty: false,
      hideNavbarOnScroll: false,
      hideToolbarOnScroll: false,
      className: '',
      firstOfPageAfterIn: true,
      statusOfPageAfterIn: false,
    };
  },
  created() {
    this.hideNavbarOnScroll = this._getHideNavbarOnScroll();
    this.hideToolbarOnScroll = this._getHideToolbarOnScroll();
  },
  mounted() {
    // page
    const $page = this.$$(this.$el);
    // navbar
    const navbar = $page.find('.navbar');
    if (navbar.length > 0) {
      this._watchTitle = navbar[0].__vue__.$watch('title', value => {
        this.setPageTitle(value);
      });
    }
    // page route
    if (this.$meta.config.env === 'development') {
      $page.attr('data-dev-page-url', this.$pageRoute.url);
    }
    // page class
    const pageClassName = 'eb-page' + this.$pageRoute.path.replace(/\//g, '-');
    this.className = this.$vuef7.utils.classNames(this.ebClassName, pageClassName);
  },
  beforeDestroy() {
    if (this._watchTitle) {
      this._watchTitle();
      this._watchTitle = null;
    }
  },
  methods: {
    getPageTitle() {
      return this.pageTitle;
    },
    setPageTitle(title) {
      if (this.pageTitle === title) return;
      this.pageTitle = title;
      this.onTitleChange(false);
    },
    getPageDirty() {
      return this.pageDirty;
    },
    setPageDirty(dirty) {
      if (this.pageDirty === dirty) return;
      this.pageDirty = dirty;
      this.onTitleChange(false);
    },
    _tryParsePageTitle() {
      let title;
      // navbar value
      const navbar = this.$$(this.$el).find('.navbar');
      if (navbar.length > 0) {
        title = navbar[0].__vue__.title;
        if (title) return title;
      }
      // navbar dom
      title = this.$$(this.$el).find('.navbar .title').text();
      if (title) return title;
      // page meta
      const page = this.$page;
      const _title = page && page.$options.meta && page.$options.meta.title;
      if (_title) {
        title = this.$text(_title);
      }
      // ok
      return title;
    },
    onPageAfterIn(page) {
      if (this.eventTargetEl !== page.el) return;
      this.setState({
        routerPositionClass: 'page-current',
      });
      if (!this.statusOfPageAfterIn) {
        this.statusOfPageAfterIn = true;
      }
      // event
      this.dispatchEvent('page:afterin pageAfterIn', page, this.firstOfPageAfterIn);
      if (this.firstOfPageAfterIn) {
        this.firstOfPageAfterIn = false;
      }

      // title
      if (this.pageTitle === null) {
        this.pageTitle = this._tryParsePageTitle();
      }
      this.onTitleChange(true);
    },
    onTitleChange(force) {
      if (force || this.$$(this.$el).hasClass('page-current')) {
        const pageTitle = this._adjustPageTitle();
        this.$view.$emit('view:title', { page: this, title: pageTitle });
      }
    },
    _adjustPageTitle() {
      let pageTitle = this.pageTitle;
      if (!this.pageDirty) return pageTitle;
      if (!pageTitle || pageTitle.indexOf(__prefix) !== 0) {
        pageTitle = `${__prefix}${pageTitle}`;
      }
      return pageTitle;
    },
    _getHideNavbarOnScroll() {
      return this.ebHideNavbarOnScroll === undefined ? this.$device.hostEnabled : this.ebHideNavbarOnScroll;
    },
    _getHideToolbarOnScroll() {
      return this.ebHideToolbarOnScroll === undefined ? this.$device.hostEnabled : this.ebHideToolbarOnScroll;
    },
    getAbsoluteUrl() {
      return this.$meta.util.combineHash(this.$pageRoute.url);
    },
    async waitPageAfterIn() {
      let index = 0;
      while (!this.statusOfPageAfterIn) {
        if (++index === 20) {
          throw new Error('timeout for pageAfterIn');
        }
        await this.$meta.util.sleep(100);
      }
      return true;
    },
  },
};
