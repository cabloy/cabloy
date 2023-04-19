export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    getDisplayName() {
      const { property } = this.context;
      const displayName = property.ebParams?.displayName || this.mapper2.userName;
      return this.context.getValue(displayName);
    },
    getDisplayAvatar() {
      const { property } = this.context;
      const displayAvatar = property.ebParams?.displayAvatar || this.mapper2.avatar;
      return this.context.getValue(displayAvatar);
    },
    getAvatarUrl(avatar, size) {
      return this.$meta.util.combineAvatarUrl(avatar, size);
    },
  },
  render() {
    const { key } = this.context;
    const value = parseInt(this.context.getValue() || 0);
    const userName = this.context.getValue(`_${key}Name`);
    const userAvatar = this.context.getValue(`_${key}Avatar`);
    let domImg;
    let domUserName;
    if (value) {
      domImg = <img class="avatar avatar16" src={this.getAvatarUrl(userAvatar, 16)} />;
      domUserName = <span>{userName}</span>;
    }
    return (
      <f7-list-item>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after" class="display-flex align-items-center">
          {domImg}
          {domUserName}
        </div>
      </f7-list-item>
    );
  },
};
