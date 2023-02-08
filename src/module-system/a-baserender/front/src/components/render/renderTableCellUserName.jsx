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
    getAvatarUrl(avatar, size) {
      return this.$meta.util.combineAvatarUrl(avatar, size);
    },
  },
  render() {
    const { column, record } = this.info;
    // userId
    const userId = parseInt(this.info.text || 0);
    const key = column.key;
    const userNameField = (this.mapper && this.mapper.userName) || `_${key}Name`;
    const avatarField = (this.mapper && this.mapper.avatar) || `_${key}Avatar`;
    const userName = record[userNameField];
    const userAvatar = record[avatarField];
    // avatar
    let domImg;
    let domUserName;
    if (userId) {
      domImg = <img class="avatar avatar24 eb-vertical-align" src={this.getAvatarUrl(userAvatar, 24)} />;
      domUserName = <span>&nbsp;{userName}</span>;
    }
    return (
      <div>
        {domImg}
        {domUserName}
      </div>
    );
  },
};
