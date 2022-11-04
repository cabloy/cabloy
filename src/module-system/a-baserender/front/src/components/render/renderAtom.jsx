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
      // target
      let target = property.ebParams.target;
      if (target === undefined) target = '_self';
      // atomClass
      const atomClass = property.ebParams.atomClass;
      // selectOptions
      const selectOptions = property.ebParams.selectOptions;
      // atomId: maybe from host
      //         should not from host
      // let atomId = (validate.host && validate.host.atomId) || property.ebParams.atomId;
      let atomId = property.ebParams.atomId;
      if (typeof atomId === 'string') {
        atomId = this.context.getValue(atomId);
      } else {
        atomId = atomId || 0;
      }
      // mapper
      const mapper = property.ebParams.mapper;
      return new Promise(resolve => {
        const url = '/a/basefront/atom/select';
        this.$view.navigate(url, {
          target,
          context: {
            params: {
              selectMode: 'single',
              selectedAtomId: atomId,
              atomClass,
              options: selectOptions,
            },
            callback: (code, selectedAtom) => {
              if (code === 200) {
                // mapper
                if (mapper) {
                  for (const key in mapper) {
                    const value = selectedAtom[mapper[key]];
                    this.context.setValue(value, key);
                  }
                } else {
                  const value = selectedAtom[key];
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
    const title = this.context.getTitle();
    const value = this.context.getValue();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={title}>
          <div slot="after">{value}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseAtom}>
        <div slot="after">{value}</div>
      </eb-list-item-choose>
    );
  },
};
