<script>
import Vue from 'vue';
const f7Navbar = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-navbar'].extendOptions);
delete f7Navbar.props.backLink;
export default {
  meta: {
    global: true,
  },
  name: 'eb-navbar',
  extends: f7Navbar,
  props: {
    ebBackLink: [ Boolean, String ],
  },
  data() {
    return {
      backLink: false,
    };
  },
  mounted() {
    this.checkBackLink();
  },
  methods: {
    checkBackLink() {
      this.backLink = (this.ebBackLink && this.$meta.vueLayout.backLink(this)) ? this.ebBackLink : false;
    },
  },
};

</script>
<style scoped>
</style>
