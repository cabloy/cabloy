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
    save() {
      const { validate } = this.context;
      return validate.perform(null, { action: 'save' });
    },
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChooseEditContent() {
      const { data, validate } = this.context;
      if (!data.categoryId) {
        this.$view.dialog.alert(this.$text('Please specify the category name'));
        return false;
      }
      const url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        target: validate.readOnly ? '_self' : undefined,
        context: {
          params: {
            ctx: this,
            item: data,
            readOnly: validate.readOnly,
          },
          callback: (code, res) => {
            if (code === 200) {
              data.content = res.content;
            }
          },
        },
      });
    },
  },
  render() {
    const { dataPath } = this.context;
    const title = this.context.getTitle();
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseEditContent}>
      </eb-list-item-choose>
    );
  },
};
