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
