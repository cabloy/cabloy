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
      this.$view.$emit('view:title', { page: this, title });
    },
  },
};

</script>
<style scoped>


</style>
