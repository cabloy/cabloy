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
  computed: {
    value() {
      return this.context.getValue();
    },
    atomClass() {
      const value = this.value;
      // atomClass
      return value && typeof value === 'string' ? window.JSON5.parse(value) : value;
    },
    atomClassTitle() {
      const atomClassBase = this.getAtomClass(this.atomClass);
      return atomClassBase ? atomClassBase.titleLocale : null;
    },
  },
  created() {},
  methods: {
    async onChooseAtomClass() {
      const { property } = this.context;
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // optional
      const optional = this.$meta.util.getProperty(property, 'ebParams.optional');
      // simple
      const simple = this.$meta.util.getProperty(property, 'ebParams.simple');
      // inner
      const inner = this.$meta.util.getProperty(property, 'ebParams.inner');
      return new Promise(resolve => {
        const url = '/a/basefront/atom/selectAtomClass';
        this.$view.navigate(url, {
          target,
          context: {
            params: {
              atomClass: this.atomClass,
              optional,
              simple,
              inner,
            },
            callback: (code, data) => {
              if (code === 200) {
                // string
                let value;
                if (property.type === 'string') {
                  value = data ? JSON.stringify(data) : null;
                } else {
                  value = data;
                }
                // setValue
                this.context.setValue(value);
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
