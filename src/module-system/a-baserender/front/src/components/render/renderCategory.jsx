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
        targetEl: event.currentTarget,
      };
      let language;
      if (parcel.data.atomLanguage) {
        language = parcel.data.atomLanguage;
      } else {
        // when need locale, throw error on no selection
        const locale = await this.$meta.util.performAction({ ctx: this, action, item: parcel.data });
        if (locale) {
          language = locale.value;
          this.context.setValue(locale.value, 'atomLanguage');
        }
      }
      // selectedCategoryIds
      const atomCategoryId = this.context.getValue('atomCategoryId');
      const selectedCategoryIds = [atomCategoryId];
      // select
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries(
          '/a/basefront/category/select',
          this.combineAtomClassAndLanguage(language)
        );
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              categoryIdStart: 0,
              leafOnly: true,
              selectedCategoryIds,
            },
            callback: (code, node) => {
              if (code === 200) {
                if (node) {
                  this.context.setValue(node.id, 'atomCategoryId');
                  this.context.setValue(node.data.categoryName, 'atomCategoryName');
                  this.context.setValue(node.data.categoryNameLocale, 'atomCategoryNameLocale');
                } else {
                  this.context.setValue(0, 'atomCategoryId');
                  this.context.setValue('', 'atomCategoryName');
                  this.context.setValue('', 'atomCategoryNameLocale');
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
    const { parcel, dataPath, property, validate } = this.context;
    const categoryName = parcel.data.atomCategoryNameLocale || parcel.data.atomCategoryName;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{categoryName}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseCategory}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{categoryName}</div>
      </eb-list-item-choose>
    );
  },
};
