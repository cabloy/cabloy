<script>
import Vue from 'vue';
const f7Navbar = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-navbar'].extendOptions);
delete f7Navbar.props.backLink;
delete f7Navbar.props.closeLink;
delete f7Navbar.props.sizeLink;
export default {
  meta: {
    global: true,
  },
  name: 'eb-navbar',
  extends: f7Navbar,
  props: {
    ebBackLink: [Boolean, String],
  },
  data() {
    return {
      backLink: false,
      closeLink: false,
      sizeLink: false,
    };
  },
  mounted() {
    this.checkBackLink();
    this.checkCloseLink();
    this.checkSizeLink();
  },
  methods: {
    checkBackLink() {
      this.backLink = this.ebBackLink && this.$meta.vueLayout.backLink(this) ? this.ebBackLink : false;
    },
    checkCloseLink() {
      this.closeLink = this.$meta.vueLayout.closeLink && this.$meta.vueLayout.closeLink(this);
    },
    checkSizeLink() {
      this.sizeLink = this.$meta.vueLayout.sizeLink && this.$meta.vueLayout.sizeLink(this);
    },

    onBackClick(event) {
      const res = this.$meta.vueLayout.onBackClick && this.$meta.vueLayout.onBackClick(this, event);
      if (!res) {
        this.dispatchEvent('back-click backClick click:back clickBack', event);
      }
    },

    onCloseClick(event) {
      const res = this.$meta.vueLayout.onCloseClick && this.$meta.vueLayout.onCloseClick(this, event);
      if (!res) {
        this.dispatchEvent('close-click closeClick click:close clickClose', event);
      }
    },

    onSizeClick(event) {
      const res = this.$meta.vueLayout.onSizeClick && this.$meta.vueLayout.onSizeClick(this, event);
      if (!res) {
        this.dispatchEvent('size-click sizeClick click:size clickSize', event);
      }
    },
  },
};
</script>
<style scoped></style>
