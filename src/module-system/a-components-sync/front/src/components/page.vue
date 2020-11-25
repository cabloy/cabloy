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
  methods: {
    setPageTitle(title) {
      this.pageTitle = title;
      this.onTitleChange(false);
    },
    onPageAfterIn(page) {
      if (this.eventTargetEl !== page.el) return;
      this.setState({
        routerPositionClass: 'page-current',
      });
      this.dispatchEvent('page:afterin pageAfterIn', page);

      // title
      if (this.pageTitle === null) {
        let title = page.$el.find('.navbar .title').text();
        if (!title) {
          // try get meta
          const page = this.$page;
          const _title = page && page.$options.meta && page.$options.meta.title;
          if (_title) {
            title = this.$text(_title);
          }
        }
        this.pageTitle = title;
      }
      this.onTitleChange(true);
    },
    onTitleChange(force) {
      if (force || this.$$(this.$el).hasClass('page-current')) {
        this.$view.$emit('view:title', { page: this, title: this.pageTitle });
      }
    },
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
};

</script>
<style scoped>
</style>
