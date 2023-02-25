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
        name: 'selectResourceType',
        targetEl: event.currentTarget,
      };
      let resourceType;
      if (parcel.data.resourceType) {
        resourceType = parcel.data.resourceType;
      } else {
        const resourceType = await this.$meta.util.performAction({ ctx: this, action, item: parcel.data });
        if (resourceType) {
          this.context.setValue(resourceType, 'resourceType');
        }
      }
      // get categoryId from resourceType
      const categoryRoot = await this.$api.post('/a/base/category/child', {
        atomClass: this.atomClass,
        categoryId: 0,
        categoryName: resourceType,
      });
      const categoryIdStart = categoryRoot.id;
      // select
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.atomClass);
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              categoryIdStart,
              leafOnly: true,
              setLocale: true,
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
