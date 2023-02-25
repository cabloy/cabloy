export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      dict: null,
      dictItem: null,
      dictItemTitle: null,
      dictItemOptions: null,
    };
  },
  computed: {
    value() {
      return this.context.getValue();
    },
    needLoadDict() {
      const { property, validate } = this.context;
      return (!validate.readOnly && !property.ebReadOnly) || property.ebParams.forceLoad;
    },
  },
  watch: {
    context() {
      this._loadDict();
    },
    value() {
      this._loadDictItem();
    },
  },
  created() {
    this._loadDict();
  },
  methods: {
    async _loadDict() {
      const { property } = this.context;
      const dictKey = property.ebParams.dictKey;
      if (this.needLoadDict) {
        this.dict = await this.$store.dispatch('a/dict/getDict', { dictKey });
      }
      // load dict item
      await this._loadDictItem();
    },
    async _loadDictItem() {
      const { key, property } = this.context;
      const dictKey = property.ebParams.dictKey;
      if (!this.needLoadDict) {
        this.dictItemTitle = this.context.getValue(`_${key}TitleLocale`);
        this.dictItemOptions = this.context.getValue(`_${key}Options`);
      } else {
        const code = this.context.getValue();
        const separator = property.ebParams.separator;
        this.dictItem = await this.$store.dispatch('a/dict/findItem', { dictKey, code, options: { separator } });
        this.dictItemTitle = this.dictItem ? this.dictItem.titleLocaleFull : null;
        this.dictItemOptions = this.dictItem ? this.dictItem.options : null;
      }
    },
    async onChooseDictItem() {
      const { property } = this.context;
      let leafOnly = property.ebParams.leafOnly;
      if (leafOnly === undefined) leafOnly = true;
      const title = this.context.getTitle(true);
      // selectedCodes
      const code = this.value;
      const selectedCodes = code ? [code] : [];
      // select
      return new Promise(resolve => {
        const url = '/a/dict/dict/select';
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              title,
              dict: this.dict,
              leafOnly,
              selectedCodes,
            },
            callback: async (code, node) => {
              if (code === 200) {
                this._onChangeDictItem(node && node.id);
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
    onSelectChange(value) {
      this._onChangeDictItem(value);
    },
    async _onChangeDictItem(value) {
      const { key } = this.context;
      const fieldTitle = `_${key}Title`;
      const fieldTitleLocale = `_${key}TitleLocale`;
      if (!this._checkIfEmptyForSelect(value)) {
        this.context.setValue(value, key);
        await this._loadDictItem();
        this.context.setValue(this.dictItem.titleFull, fieldTitle);
        this.context.setValue(this.dictItem.titleLocaleFull, fieldTitleLocale);
      } else {
        this.context.setValue(null, key);
        this.context.setValue('', fieldTitle);
        this.context.setValue('', fieldTitleLocale);
      }
    },
    _checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    },
    _renderAsSelect() {
      const { parcel, key, property } = this.context;
      const options = this.dict._dictItems.map(item => {
        return {
          title: item.titleLocale,
          value: item.code,
        };
      });
      const propertyNew = this.$utils.extend({}, property, {
        ebType: 'select',
        ebOptions: options,
        ebParams: null,
      });
      return (
        <eb-list-item-validate
          parcel={parcel}
          dataKey={key}
          property={propertyNew}
          onChange={this.onSelectChange}
        ></eb-list-item-validate>
      );
    },
    _renderAsTree() {
      const { dataPath } = this.context;
      return (
        <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseDictItem}>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{this._renderItemTitle()}</div>
        </eb-list-item-choose>
      );
    },
    _renderItemTitle() {
      const domTitle = <span>{this.dictItemTitle}</span>;
      const icon = this.dictItemOptions && this.dictItemOptions.icon;
      if (!icon) return domTitle;
      const domIcon = <f7-icon size="18" f7={icon.f7} material={icon.material}></f7-icon>;
      return (
        <div class="display-flex">
          {domIcon}
          {domTitle}
        </div>
      );
    },
  },
  render() {
    const { property, validate } = this.context;
    // readOnly
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{this._renderItemTitle()}</div>
        </f7-list-item>
      );
    }
    // write
    if (!this.dict) return <div></div>;
    const mode = property.ebParams && property.ebParams.mode;
    if (!mode || mode === 'select') {
      return this._renderAsSelect();
    }
    return this._renderAsTree();
  },
};
