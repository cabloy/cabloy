import Vue from 'vue';
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;

export default {
  mixins: [ebPageDirty],
  data() {
    return {};
  },
  computed: {
    page_title() {
      return this.page_getTitle();
    },
  },
  methods: {
    page_getTitle() {
      let title;
      if (!this.base.item) {
        title = this.$text('Details');
      } else {
        title = this.base.item.detailName;
      }
      return this.page_getDirtyTitle(title);
    },
    page_getSubtitle() {
      return '';
    },
  },
};
