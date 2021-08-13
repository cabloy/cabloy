<script>
import Vue from 'vue';
const f7Page = Vue.options.components['f7-page'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-page',
  extends: f7Page,
  data() {
    return {
      pageTitle: null,
    };
  },
  mounted() {
    const navbar = this.$$(this.$el).find('.navbar');
    if (navbar.length > 0) {
      this._watchTitle = navbar[0].__vue__.$watch('title', value => {
        this.pageTitle = value;
        this.onTitleChange(false);
      });
    }
  },
  beforeDestroy() {
    if (this._watchTitle) {
      this._watchTitle();
      this._watchTitle = null;
    }
  },
  methods: {
    setPageTitle(title) {
      this.pageTitle = title;
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
      this.dispatchEvent('page:afterin pageAfterIn', page);

      // title
      if (this.pageTitle === null) {
        this.pageTitle = this._tryParsePageTitle();
      }
      this.onTitleChange(true);
    },
    onTitleChange(force) {
      if (force || this.$$(this.$el).hasClass('page-current')) {
        this.$view.$emit('view:title', { page: this, title: this.pageTitle });
      }
    },
  },
};
</script>
<style scoped></style>
