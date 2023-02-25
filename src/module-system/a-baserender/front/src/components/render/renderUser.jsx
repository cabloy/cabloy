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
                // mapper
                if (mapper) {
                  for (const key in mapper) {
                    const value = selectedUser[mapper[key]];
                    this.context.setValue(value, key);
                  }
                } else {
                  const value = selectedUser[key];
                  this.context.setValue(value, key);
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
  },
  render() {
    const { dataPath, property, validate } = this.context;
    const value = this.context.getValue();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{value}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseUser}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{value}</div>
      </eb-list-item-choose>
    );
  },
};
