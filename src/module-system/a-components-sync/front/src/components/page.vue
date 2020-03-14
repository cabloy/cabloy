<script>
import Vue from 'vue';
const f7Page = Vue.options.components['f7-page'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-page',
  extends: f7Page,
  methods: {
    onPageAfterIn(page) {
      if (this.eventTargetEl !== page.el) return;
      this.setState({
        routerPositionClass: 'page-current'
      });
      this.dispatchEvent('page:afterin pageAfterIn', page);

      // title
      let title = page.$el.find('.navbar .title').text();
      if (!title) {
        // try get meta
        const page = this.$page;
        const _title = page && page.$options.meta && page.$options.meta.title;
        if (_title) {
          title = this.$text(_title);
        }
      }
      this.onTitleChange(title, true);
    },
    onTitleChange(title, force) {
      if (force || this.$$(this.$el).hasClass('page-current')) {
        this.$view.$emit('view:title', { page: this, title });
      }
    },
  },
  mounted() {
    const navbar = this.$$(this.$el).find('.navbar');
    if (navbar.length > 0) {
      this._watchTitle = navbar[0].__vue__.$watch('title', value => {
        this.onTitleChange(value, false);
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
