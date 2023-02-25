import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  mixins: [ebAtomClasses],
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
    async onChooseAtom() {
      const { key, property } = this.context;
      // value is atomId
      const value = this.context.getValue();
      // target
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // atomClass
      const atomClass = property.ebParams.atomClass;
      // selectOptions
      const selectOptions = property.ebParams.selectOptions;
      // mapper
      const mapper = property.ebParams.mapper || {};
      return new Promise(resolve => {
        const url = '/a/basefront/atom/select';
        this.$view.navigate(url, {
          target,
          context: {
            params: {
              selectMode: 'single',
              selectedAtomId: value,
              atomClass,
              options: selectOptions,
            },
            callback: (code, selectedAtom) => {
              if (code === 200) {
                // atomId
                this.context.setValue(selectedAtom.atomId, key);
                // mapper
                for (const _key in mapper) {
                  this.context.setValue(selectedAtom[_key], mapper[_key]);
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
      const { key, property } = this.context;
      let displayName = property.ebParams.displayName;
      if (!displayName) {
        const mapper = property.ebParams.mapper || {};
        displayName = mapper.atomName;
      }
      if (displayName) {
        return this.context.getValue(displayName);
      }
      const title1 = `_${key}TitleLocale`;
      const title2 = `_${key}Title`;
      return this.context.getValue(title1) || this.context.getValue(title2);
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
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseAtom}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{displayName}</div>
      </eb-list-item-choose>
    );
  },
};
