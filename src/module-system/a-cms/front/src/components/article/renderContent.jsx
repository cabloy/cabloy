import utils from '../../common/utils.js';
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
    atomClass() {
      const { parcel } = this.context;
      return {
        module: parcel.data.module,
        atomClassName: parcel.data.atomClassName,
      };
    },
  },
  created() {},
  methods: {
    onSave() {
      const { validate } = this.context;
      return validate.perform(null, { action: 'save' });
    },
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChooseEditContent() {
      const { parcel, property, validate } = this.context;
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      const url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        target,
        context: {
          params: {
            item: parcel.data,
            readOnly: validate.readOnly || property.ebReadOnly,
            onSave: () => {
              return this.onSave();
            },
          },
          callback: (code, res) => {
            if (code === 200) {
              this.context.setValue(res.content);
            }
          },
        },
      });
    },
  },
  render() {
    const { dataPath } = this.context;
    const title = this.context.getTitle();
    return <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseEditContent}></eb-list-item-choose>;
  },
};
