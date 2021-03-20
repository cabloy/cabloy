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
    combineAtomClassAndLanguage(language) {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (language) {
        queries.language = language;
      }
      return queries;
    },
    async onChooseCategory(event) {
      const { parcel } = this.context;
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
        targetEl: event.target,
      };
      let language;
      if (data.atomLanguage) {
        language = data.atomLanguage;
      } else {
        const locale = await this.$meta.util.performAction({ ctx: this, action, item: data });
        if (locale) {
          language = locale.value;
          data.atomLanguage = locale.value;
        }
      }
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.combineAtomClassAndLanguage(language));
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              categoryIdStart: 0,
              leafOnly: true,
            },
            callback: (code, node) => {
              if (code === 200) {
                if (node) {
                  this.$set(data, 'atomCategoryId', node.id);
                  this.$set(data, 'atomCategoryName', node.data.categoryName);
                } else {
                  this.$set(data, 'atomCategoryId', 0);
                  this.$set(data, 'atomCategoryName', '');
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
    const { data, dataPath, property, validate } = this.context;
    const title = this.context.getTitle();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={title}>
          <div slot="after">{data.atomCategoryName}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseCategory}>
        <div slot="after">{data.atomCategoryName}</div>
      </eb-list-item-choose>
    );
  },
};
