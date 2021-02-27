export default {
  data() {
    return {
    };
  },
  methods: {
    page_getTitle() {
      return `${this.$text('Messages')}: ${this.container.messageClass.info.titleLocale}`;
    },
    page_getSubtitle() {
      return '';
    },
  },
};
