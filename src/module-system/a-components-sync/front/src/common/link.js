export default {
  props: {
    ebHref: {
      type: [ String, Boolean ],
    },
    ebTarget: {
      type: String,
    },
    externalLink: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    ebHref(value) {
      this.$nextTick(() => {
        this.href = this.getHref(value);
      });
    },
  },
  data() {
    return {
      href: false,
    };
  },
  mounted() {
    // href
    this.href = this.getHref(this.ebHref);
    // class
    if (this.externalLink) {
      this.$$(this.$el).addClass('external');
    }
  },
  methods: {
    getHref(href) {
      if (!href) return href;
      if (!this.$page) return href;
      const module = this.$page.$module;
      if (!module) return href;
      return this.$meta.util.combinePagePath(module.info, href);
    },
    onLinkClick(event) {
      if (!this.externalLink) return;

      const href = this.href;
      const target = this.ebTarget;
      if (!href) return;

      this.$meta.vueLayout.navigate(href, { ctx: this, target });
    },
  },
};
