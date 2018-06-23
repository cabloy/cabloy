export default {
  props: {
    ebHref: {
      type: [ String, Boolean ],
    },
    ebTarget: {
      type: String,
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
    // target
    if (this.ebTarget === 'self') {
      const view = this.$$(this.$view.$el);
      let selfClass = view.data('selfClass');
      if (!selfClass) {
        selfClass = this.$meta.util.nextId('selfClass');
        view.data('selfClass', selfClass);
        view.addClass(selfClass);
      }
      this.$el.dataset.view = '.' + selfClass;
    }
    // href
    this.href = this.getHref(this.ebHref);
  },
  methods: {
    getHref(href) {
      if (!href) return href;
      const page = this.$page;
      if (!page || !page.$module) return false;
      return this.$meta.util.combinePagePath(page.$module.info, href);
    },
  },
};
