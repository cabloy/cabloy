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
    combineAtomClassAndLanguage(locale) {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (locale) {
        queries.language = locale.value;
      }
      return queries;
    },
    async onChooseCategory(event) {
      const { data } = this.context;
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
        targetEl: event.target,
      };
      let locale;
      if (data.atomLanguage) {
        locale = data.atomLanguage;
      } else {
        locale = await this.$meta.util.performAction({ ctx: this, action, item: data });
        if (locale) {
          data.atomLanguage = locale.value;
        }
      }
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.combineAtomClassAndLanguage(locale));
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              categoryIdStart: 0,
              leafOnly: true,
            },
            callback: (code, node) => {
              if (code === 200) {
                data.atomCategoryId = node.id;
                data.atomCategoryName = node.data.categoryName;
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
