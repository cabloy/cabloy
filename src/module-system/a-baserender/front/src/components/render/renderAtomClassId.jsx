export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      atomClassBase: null,
    };
  },
  computed: {
    value() {
      return this.context.getValue();
    },
    atomClassId() {
      return this.value;
    },
    atomClassTitle() {
      return this.atomClassBase?.titleLocale;
    },
    selectedAtomClass() {
      if (!this.atomClassBase) return null;
      return {
        module: this.atomClassBase.module,
        atomClassName: this.atomClassBase.atomClassName,
      };
    },
  },
  watch: {
    atomClassId: {
      handler(newValue) {
        this.__changeAtomClass(newValue);
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    async __changeAtomClass(atomClassId) {
      if (!atomClassId) {
        this.atomClassBase = null;
        return;
      }
      // atomClassBase
      this.atomClassBase = await this.$store.dispatch('a/base/getAtomClassBase', { atomClass: { id: atomClassId } });
    },
    async __onChooseChanged(atomClass) {
      const { key, property } = this.context;
      // change atomClassBase
      this.atomClassBase = await this.$store.dispatch('a/base/getAtomClassBase', { atomClass });
      // atomClassId
      this.context.setValue(this.atomClassBase.id, key);
      // mapper
      const mapper = property.ebParams.mapper;
      if (mapper) {
        for (const _key in mapper) {
          this.context.setValue(this.atomClassBase[_key], mapper[_key]);
        }
      }
    },
    async onChooseAtomClass() {
      const { property } = this.context;
      // target
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // optional
      const optional = this.$meta.util.getProperty(property, 'ebParams.optional');
      // check: itemOnly/inner/detail/simple/resource
      const check = this.$meta.util.getProperty(property, 'ebParams.check');
      // mapper
      const mapper = property.ebParams.mapper || {};
      return new Promise(resolve => {
        const url = '/a/basefront2/atom/selectAtomClass';
        this.$view.navigate(url, {
          target,
          context: {
            params: {
              selectedAtomClass: this.selectedAtomClass,
              optional,
              check,
            },
            callback: (code, atomClass) => {
              if (code === 200) {
                this.__onChooseChanged(atomClass);
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
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{this.atomClassTitle}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseAtomClass}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{this.atomClassTitle}</div>
      </eb-list-item-choose>
    );
  },
};
