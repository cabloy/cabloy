export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    info: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    _getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
  },
  render() {
    return (
      <div>
        <img class="avatar avatar24 eb-vertical-align" src={this._getItemMetaMedia(this.info.record)} />
        <span>&nbsp;{this.info.text + '!'}</span>
      </div>
    );
  },
};
