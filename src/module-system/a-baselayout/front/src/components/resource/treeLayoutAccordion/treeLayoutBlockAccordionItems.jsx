export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    onItemClick(event, resource) {
      return this.layoutManager.base_onPerformResource(event, resource);
    },
    _renderCategories(categoryParent) {
      const children = [];
      if (!categoryParent.children) return children;
      for (const category of categoryParent.children) {
        const domListItems = this._renderListItems(category);
        const domCategory = (
          <f7-list-group key={category.id}>
            <f7-list-item group-title title={category.categoryNameLocale}></f7-list-item>
            {domListItems}
          </f7-list-group>
        );
        children.push(domCategory);
      }
      return children;
    },
    _renderResources(categoryParent) {
      const children = [];
      const resources = this.layoutManager.base.resourcesArrayAll.filter(item => item.atomCategoryId === categoryParent.id);
      for (const resource of resources) {
        const domResource = (
          <eb-list-item class="item" key={resource.atomId}
            link="#"
            title={resource.atomNameLocale}
            propsOnPerform={event => this.onItemClick(event, resource)}
          >
          </eb-list-item>
        );
        children.push(domResource);
      }
      return children;
    },
    _renderListItems(categoryParent) {
      if (categoryParent.categoryCatalog === 1) {
        return this._renderCategories(categoryParent);
      }
      return this._renderResources(categoryParent);
    },
    _renderAccordion(item) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.categoryNameLocale}</div>
        </div>
      );
      // domAccordionContent
      const domListItems = this._renderListItems(item);
      const domAccordionContent = (
        <f7-accordion-content>
          <eb-list inset>
            {domListItems}
          </eb-list>
        </f7-accordion-content>
      );
      // ok
      return (
        <eb-list-item key={item.id} accordion-item>
          {domTitle}
          {domAccordionContent}
        </eb-list-item>
      );
    },
    _renderAccordions() {
      if (!this.layoutManager.base_ready) return;
      const items = this.layoutManager.base.treeData;
      const children = [];
      for (const item of items) {
        children.push(this._renderAccordion(item));
      }
      return (
        <eb-list accordion-list>
          {children}
        </eb-list>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderAccordions()}
      </div>
    );
  },
};
