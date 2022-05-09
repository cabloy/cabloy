export default {
  data() {
    return {};
  },
  methods: {
    page_ptr() {
      return true;
    },
    page_infinite() {
      return true;
    },
    page_onGetTitle() {
      return `${this.$text('Messages')}: ${this.container.messageClass.info.titleLocale}`;
    },
    page_onGetTitleSub() {
      return '';
    },
  },
};
