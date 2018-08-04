<script>
import Vue from 'vue';
const f7Page = Vue.options.components['f7-page'].extendOptions;
export default {
  name: 'eb-page',
  extends: f7Page,
  methods: {
    onPageInit(event) {
      // event
      this.dispatchEvent('page:init pageInit', event, event.detail);
      // title
      const title = this.$$(event.target).find('.navbar .title').text();
      this.onTitleChange(title, true);
    },
    onPageReinit(event) {
      this.dispatchEvent('page:reinit pageReinit', event, event.detail);
      // title
      const title = this.$$(event.target).find('.navbar .title').text();
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
