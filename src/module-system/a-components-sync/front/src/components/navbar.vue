<script>
import Vue from 'vue';
const f7Navbar = Vue.options.components.f7Navbar;
delete f7Navbar.props.backLink;
export default {
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
    if (!this.ebBackLink) return;
    if (this.$meta.vueLayout.backLink(this)) this.backLink = this.ebBackLink;
  },
};

</script>
<style scoped>


</style>
