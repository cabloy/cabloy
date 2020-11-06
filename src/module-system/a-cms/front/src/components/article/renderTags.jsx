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
    adjustTags(tags) {
      if (!tags) return '';
      const _tags = JSON.parse(tags);
      return _tags.map(item => item.name).join(',');
    },
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChooseTags() {
      const { data } = this.context;
      if (!data.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }
      return new Promise(resolve => {
        const url = this.combineAtomClass('/a/cms/tag/select');
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              language: data.language,
              tags: data.tags,
            },
            callback: (code, tags) => {
              if (code === 200) {
                data.tags = tags;
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
    const { data, dataPath, property, validate } = this.context;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={this.$text('Tags')}>
          <div slot="after">{this.adjustTags(data.tags)}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={this.$text('Tags')} propsOnChoose={this.onChooseTags}>
        <div slot="after">{this.adjustTags(data.tags)}</div>
      </eb-list-item-choose>
    );
  },
};
