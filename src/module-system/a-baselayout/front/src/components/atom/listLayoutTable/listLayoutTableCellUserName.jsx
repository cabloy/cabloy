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
      const avatarFieldName = (this.mapper && this.mapper.avatar) || undefined;
      return this.layoutManager.data.adapter.item_renderMedia(
        this.info.record,
        'avatar avatar24 eb-vertical-align',
        avatarFieldName
      );
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
