export default {
  methods: {
    renderProperties(context) {
      const { parcel, groupWhole } = context;
      // children
      let children = [];
      // index
      const keys = Object.keys(parcel.properties);
      const count = keys.length;
      let index = 0;
      // patch first group
      const propertyGroupFirst = this._renderProperties_patchFirstGroup({ parcel });
      if (propertyGroupFirst) {
        index = -1;
      }
      // groupCount
      let groupCount = 0;
      while (index < count) {
        let key;
        let property;
        if (index === -1) {
          key = propertyGroupFirst.key;
          property = propertyGroupFirst.property;
        } else {
          key = keys[index];
          property = parcel.properties[key];
        }
        // context
        const context2 = this.getContext({
          parcel,
          key,
          property,
          meta: this.meta,
          index,
          groupCount,
          groupWhole,
        });
        // render
        const item = this._renderItem(context2);
        if (item) {
          if (Array.isArray(item)) {
            children = children.concat(item);
          } else {
            children.push(item);
          }
        }
        // groupCount
        groupCount = context2.groupCount;
        // next
        index = context2.index + 1;
      }
      // groupCount
      if (groupCount % 2 === 1) {
        groupCount++;
        children.push(this.renderGroupEmpty());
      }
      // ok
      return children;
    },
    _renderProperties_patchFirstGroup({ parcel }) {
      // only for top level
      if (parcel.pathParent !== '') return null;
      // check first property
      const keys = Object.keys(parcel.properties);
      const property = parcel.properties[keys[0]];
      if (!property) return null;
      if (property.ebType === 'group' || property.ebType === 'group-flatten') return null;
      return {
        key: '__groupFirst',
        property: {
          ebType: 'group-flatten',
          ebGroupWhole: true,
          ebParams: {
            titleHidden: true,
          },
        },
      };
    },
  },
};
