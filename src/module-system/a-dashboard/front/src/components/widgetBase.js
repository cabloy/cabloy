export default {
  props: {
    widget: {
      type: Object,
    },
    title: {
      type: String,
    },
    widthSmall: {
      type: Number,
    },
    widthMedium: {
      type: Number,
    },
    widthLarge: {
      type: Number,
    },
    height: {
      type: String,
    },
  },
  data() {
    return {
      attrTitle: null,
      attrWidthSmall: null,
      attrWidthMedium: null,
      attrWidthLarge: null,
      attrHeight: null,
    };
  },
  watch: {
    title() {
      this.attrTitle = this.title;
    },
    widthSmall() {
      this.attrWidthSmall = this.widthSmall;
    },
    widthMedium() {
      this.attrWidthMedium = this.widthMedium;
    },
    widthLarge() {
      this.attrWidthLarge = this.widthLarge;
    },
    height() {
      this.attrHeight = this.height;
    },
  },
  created() {
    this.attrTitle = this.title;
    this.attrWidthSmall = this.widthSmall;
    this.attrWidthMedium = this.widthMedium;
    this.attrWidthLarge = this.widthLarge;
    this.attrHeight = this.height;
  },
  mounted() {
    this.$emit('widgetReal:ready', this);
  },
  beforeDestroy() {
    this.$emit('widgetReal:destroy', this);
  },
};
