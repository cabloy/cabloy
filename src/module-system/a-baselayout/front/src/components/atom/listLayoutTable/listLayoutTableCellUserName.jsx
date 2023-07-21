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
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
    mapper: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    _renderMedia() {
      const media = this.mapper?.avatar;
      return this.layoutManager.item_renderMedia2(this.info, 'avatar avatar24 eb-vertical-align', media);
    },
  },
  render() {
    // avatar
    const domMedia = this._renderMedia();
    // name
    const userNameFieldName = (this.mapper && this.mapper.userName) || undefined;
    const userName = userNameFieldName ? this.info.record[userNameFieldName] : this.info.text;
    return (
      <div>
        {domMedia}
        <span>&nbsp;{userName}</span>
      </div>
    );
  },
};
