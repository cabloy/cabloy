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
    async onChooseUser() {
      const { key, property } = this.context;
      // target
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // mapper
      const mapper = property.ebParams.mapper;
      // apiFetchUsers
      const apiFetchUsers = property.ebParams.apiFetchUsers;
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
      let displayName = property.ebParams.displayName;
      if (!displayName) {
        const mapper = property.ebParams.mapper || {};
        displayName = mapper.userName || 'userName';
      }
      if (displayName) {
        return this.context.getValue(displayName);
      }
      return null;
    },
  },
  render() {
    const { dataPath, property, validate } = this.context;
    const displayName = this.getDisplayName();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{displayName}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseUser}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{displayName}</div>
      </eb-list-item-choose>
    );
  },
};
