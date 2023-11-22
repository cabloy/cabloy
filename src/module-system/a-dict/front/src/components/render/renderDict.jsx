import Vue from 'vue';
const ebValidateComponentBase = Vue.prototype.$meta.module.get('a-components').options.mixins.ebValidateComponentBase;

const __DictModes = ['array', 'tree'];

export default {
  mixins: [ebValidateComponentBase],
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
    ebParamsDictKey() {
      const { property } = this.context;
      return property.ebParams.dictKey;
    },
    ebParamsDict() {
      const { property } = this.context;
      return property.ebParams.dict;
    },
    needLoadDict() {
      const { property, validate } = this.context;
      return (!validate.readOnly && !property.ebReadOnly) || property.ebParams.forceLoad;
    },
  },
  watch: {
    ebParamsDictKey() {
      this._loadDict();
    },
    ebParamsDict() {
      this._loadDict();
    },
    value() {
      this._loadDictItem();
    },
  },
  created() {
    this._loadDict();
  },
  mounted() {},
  beforeDestroy() {
    this._unwatchDictKeyFrom();
  },
  methods: {
    _unwatchDictKeyFrom() {
      if (this._unwatchDictKeyFrom_value) {
        this._unwatchDictKeyFrom_value();
        this._unwatchDictKeyFrom_value = null;
      }
      if (this._unwatchDictKeyFrom_options) {
        this._unwatchDictKeyFrom_options();
        this._unwatchDictKeyFrom_options = null;
      }
    },
    _watchDictKeyFrom() {
      const { property } = this.context;
      const dictKeyFrom = property.ebParams.dictKeyFrom;
      if (!dictKeyFrom) return;
      // unwatch
      this._unwatchDictKeyFrom();
      // watch
      this._unwatchDictKeyFrom_value = this.$watch(
        () => {
          return this.context.getValue(dictKeyFrom);
        },
        () => {
          this.context.setValue(null);
        }
      );
      this._unwatchDictKeyFrom_options = this.$watch(
        () => {
          return this._getDictKeyFrom();
        },
        () => {
          this._loadDict();
        }
      );
    },
    _getDictKey() {
      const { property } = this.context;
      // dictKey
      let dictKey = property.ebParams.dictKey;
      if (dictKey) return dictKey;
      // dictKeyFrom
      dictKey = this._getDictKeyFrom();
      this._watchDictKeyFrom();
      return dictKey;
    },
    _getDictKeyFrom() {
      const { property } = this.context;
      const dictKeyFrom = property.ebParams.dictKeyFrom;
      if (!dictKeyFrom) return null;
      const fromInstance = this.context.getComponentInstance(dictKeyFrom);
      const dictKey = fromInstance?.dictItemOptions?.dictKey;
      return dictKey;
    },
    _getDictMode() {
      const { property } = this.context;
      let mode = property.ebParams && property.ebParams.mode;
      if (mode === undefined) {
        return this.dict.dictMode;
      }
      if (typeof mode === 'string') {
        mode = __DictModes.indexOf(mode);
        if (mode === -1) {
          mode = 0; // array is default
        }
      }
      return mode;
    },
    async _loadDict_inner() {
      const { property } = this.context;
      // direct set from outer
      const dict = property.ebParams.dict;
      if (dict) {
        this.dict = dict;
        return;
      }
      // not need load dict
      if (!this.needLoadDict) {
        this.dict = null;
        return;
      }
      // dictKey
      const dictKey = this._getDictKey();
      if (!dictKey) {
        this.dict = null;
        return;
      }
      // load from store
      const useStoreDict = await this.$store.use('a/dict/dict');
      this.dict = await useStoreDict.getDict({
        dictKey,
      });
    },
    async _loadDict() {
      // load dict
      await this._loadDict_inner();
      // load dict item
      await this._loadDictItem();
    },
    async _loadDictItem() {
      const { key, property } = this.context;
      // const dictKey = property.ebParams.dictKey;
      if (!this.needLoadDict) {
        this.dictItemTitle = this.context.getValue(`_${key}TitleLocale`);
        this.dictItemOptions = this.context.getValue(`_${key}Options`);
      } else {
        if (this.dict) {
          const code = this.context.getValue();
          const separator = property.ebParams.separator;
          const useStoreDict = await this.$store.use('a/dict/dict');
          this.dictItem = await useStoreDict.findItem({
            dict: this.dict,
            // dictKey,
            code,
            options: { separator },
          });
          this.dictItemTitle = this.dictItem ? this.dictItem.titleLocaleFull : null;
          this.dictItemOptions = this.dictItem ? this.dictItem.options : null;
        }
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
        const option = {
          title: item.titleLocale,
          value: item.code,
        };
        const icon = item.options?.icon;
        if (icon) {
          option.icon = icon;
        }
        return option;
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
    const mode = this._getDictMode();
    if (mode === 0) {
      return this._renderAsSelect();
    }
    return this._renderAsTree();
  },
};
