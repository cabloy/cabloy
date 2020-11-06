import utils from '../../common/utils.js';
export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    atomClass() {
      return {
        module: this.context.data.module,
        atomClassName: this.context.data.atomClassName,
      };
    },
  },
  created() {
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChooseCategory() {
      const { data } = this.context;
      if (!data.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }
      return new Promise(resolve => {
        const url = this.combineAtomClass('/a/cms/category/select');
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              language: data.language,
              categoryIdStart: 0,
              leafOnly: true,
            },
            callback: (code, node) => {
              if (code === 200) {
                data.categoryId = node.id;
                data.categoryName = node.data.categoryName;
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
    const { data, pathParent, key, property, validate } = this.context;
    const dataPath = pathParent + key;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={this.$text('Category')}>
          <div slot="after">{data.categoryName}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={this.$text('Category')} propsOnChoose={this.onChooseCategory}>
        <div slot="after">{data.categoryName}</div>
      </eb-list-item-choose>
    );
  },
};
