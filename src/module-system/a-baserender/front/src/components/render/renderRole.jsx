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
    async onChooseRole() {
      const { key, property, validate } = this.context;
      // target
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // mapper
      const mapper = property.ebParams.mapper;
      // params
      const roleIdStart = property.ebParams.roleIdStart;
      const multiple = property.ebParams.multiple;
      const catalogOnly = property.ebParams.catalogOnly;
      const leafOnly = property.ebParams.leafOnly;
      const roleTypes = property.ebParams.roleTypes;
      const titleAlias = property.ebParams.titleAlias;
      // immediate
      const immediate = validate.host && validate.host.immediate;
      // select
      return new Promise(resolve => {
        const url = '/a/baseadmin/role/select';
        this.$view.navigate(url, {
          target,
          context: {
            params: {
              titleAlias,
              roleIdStart,
              multiple,
              catalogOnly,
              leafOnly,
              buttonClearRole: true,
              immediate,
              roleTypes,
            },
            callback: (code, selectedRole) => {
              if (code === 200) {
                // mapper
                if (mapper) {
                  for (const key in mapper) {
                    const value = selectedRole[mapper[key]];
                    this.context.setValue(value, key);
                  }
                } else {
                  const value = selectedRole[key];
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
    _getMapperKey(fieldName) {
      const { property } = this.context;
      // mapper
      const mapper = this.$meta.util.getProperty(property, 'ebParams.mapper');
      if (!mapper) return null;
      return Object.keys(mapper).find(key => {
        return mapper[key] === fieldName;
      });
    },
    _getMapperRoleName() {
      const key = this._getMapperKey('atomNameLocale') || this._getMapperKey('atomName');
      return key ? this.context.getValue(key) : this.context.getValue();
    },
  },
  render() {
    const { dataPath, property, validate } = this.context;
    const value = this._getMapperRoleName();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{value}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseRole}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{value}</div>
      </eb-list-item-choose>
    );
  },
};
