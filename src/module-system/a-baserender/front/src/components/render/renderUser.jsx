export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    mapper2() {
      const { key, property } = this.context;
      const mapper = property.ebParams?.mapper || {};
      if (!mapper.userName) {
        mapper.userName = `_${key}Name`;
      }
      if (!mapper.avatar) {
        mapper.avatar = `_${key}Avatar`;
      }
      return mapper;
    },
  },
  created() {},
  methods: {
    async onChooseUser() {
      const { key, property } = this.context;
      // target
      let target = property.ebParams?.target;
      if (target === undefined) target = '_self';
      // mapper
      const mapper = this.mapper2;
      // apiFetchUsers
      const apiFetchUsers = property.ebParams?.apiFetchUsers;
      return new Promise(resolve => {
        const url = '/a/baseadmin/user/select';
        this.$view.navigate(url, {
          target,
          context: {
            params: {
              apiFetchUsers,
              buttonClearUser: true,
            },
            callback: (code, selectedUser) => {
              if (code === 200) {
                // userId
                this.context.setValue(selectedUser.id, key);
                // mapper
                if (mapper) {
                  for (const _key in mapper) {
                    this.context.setValue(selectedUser[_key], mapper[_key]);
                  }
                }
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
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
    const { dataPath, property, validate } = this.context;
    const value = parseInt(this.context.getValue() || 0);
    let domImg;
    let domUserName;
    if (value) {
      const userName = this.getDisplayName();
      const userAvatar = this.getDisplayAvatar();
      domImg = <img class="avatar avatar16" src={this.getAvatarUrl(userAvatar, 16)} />;
      domUserName = <span>{userName}</span>;
    }
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after" class="display-flex align-items-center">
            {domImg}
            {domUserName}
          </div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseUser}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after" class="display-flex align-items-center">
          {domImg}
          {domUserName}
        </div>
      </eb-list-item-choose>
    );
  },
};
