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
      const { key, property } = this.context;
      const displayName = property.ebParams?.displayName || `_${key}Name`;
      return this.context.getValue(displayName);
    },
    getDisplayAvatar() {
      const { key, property } = this.context;
      const displayAvatar = property.ebParams?.displayAvatar || `_${key}Avatar`;
      return this.context.getValue(displayAvatar);
    },
    getAvatarUrl(avatar, size) {
      return this.$meta.util.combineAvatarUrl(avatar, size);
    },
  },
  render() {
    const value = parseInt(this.context.getValue() || 0);
    let domImg;
    let domUserName;
    if (value) {
      const userName = this.getDisplayName();
      const userAvatar = this.getDisplayAvatar();
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
