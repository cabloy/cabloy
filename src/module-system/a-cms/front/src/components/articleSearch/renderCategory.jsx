import utils from '../../common/utils.js';
export default {
  props: {
    context: {
      type: Object,
    },
    atomClass: {
      type: Object,
    },
  },
  data() {
    return {
    };
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
                this.$set(data, 'categoryId', node.id);
                this.$set(data, 'categoryName', node.data.categoryName);
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
    const { data, dataPath } = this.context;
    const title = this.context.getTitle();
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseCategory}>
        <div slot="after">{data.categoryName}</div>
      </eb-list-item-choose>
    );
  },
};
