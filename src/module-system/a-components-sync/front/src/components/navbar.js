import Vue from 'vue';
let f7Navbar = Vue.options.components['f7-navbar'].extendOptions;
f7Navbar = Vue.prototype.$meta.util.patchF7ExtendOptions(f7Navbar, 'backLink,closeLink,sizeLink');
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
  computed: {
    closeLink2() {
      return this.$meta.vueLayout.closeLink && this.$meta.vueLayout.closeLink(this);
    },
    sizeLink2() {
      return this.$meta.vueLayout.sizeLink && this.$meta.vueLayout.sizeLink(this);
    },
  },
  mounted() {
    this.checkBackLink();
    this.checkCloseLink();
    this.checkSizeLink();
  },
  beforeDestroy() {
    if (this._unwatchCloseLink) {
      this._unwatchCloseLink();
      this._unwatchCloseLink = null;
    }
    if (this._unwatchSizeLink) {
      this._unwatchSizeLink();
      this._unwatchSizeLink = null;
    }
  },
  methods: {
    checkBackLink() {
      this.backLink = this.ebBackLink && this.$meta.vueLayout.backLink(this) ? this.ebBackLink : false;
    },
    checkCloseLink() {
      this.closeLink = this.closeLink2;
      this._unwatchCloseLink = this.$watch('closeLink2', () => {
        this.closeLink = this.closeLink2;
      });
    },
    checkSizeLink() {
      this.sizeLink = this.sizeLink2;
      this._unwatchSizeLink = this.$watch('sizeLink2', () => {
        this.sizeLink = this.sizeLink2;
      });
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
