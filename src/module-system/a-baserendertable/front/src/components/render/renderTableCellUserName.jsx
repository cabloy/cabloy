import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  computed: {
    mapper() {
      return this.base_getParam({ name: 'mapper' });
    },
  },
  created() {},
  methods: {
    getAvatarUrl(avatar, size) {
      return this.$meta.util.combineAvatarUrl(avatar, size);
    },
    _getUserNameField(key) {
      if (key === 'userIdCreated') return 'userName';
      if (key === 'userIdUpdated') return 'userNameUpdated';
      return (this.mapper && this.mapper.userName) || `_${key}Name`;
    },
    _getAvatarField(key) {
      if (key === 'userIdCreated') return 'avatar';
      if (key === 'userIdUpdated') return 'avatarUpdated';
      return (this.mapper && this.mapper.avatar) || `_${key}Avatar`;
    },
  },
  render() {
    const { column, record } = this.info;
    // userId
    const userId = parseInt(this.info.text || 0);
    const key = column.key;
    const userNameField = this._getUserNameField(key);
    const avatarField = this._getAvatarField(key);
    const userName = record[userNameField];
    const userAvatar = record[avatarField];
    // avatar
    let domImg;
    let domUserName;
    if (userId !== undefined && userId !== null) {
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
