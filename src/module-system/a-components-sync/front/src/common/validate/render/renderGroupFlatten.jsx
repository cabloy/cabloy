export default {
  methods: {
    renderGroupFlatten(context) {
      let { parcel, key, property, index } = context;
      // children
      let children = [];
      while (true) {
        // next Item
        const flattenItemNext = this._getFlattenItemNext(context, index);
        if (!flattenItemNext) break;
        // context
        const context2 = this.getContext({
          parcel,
          key: flattenItemNext.key,
          property: flattenItemNext.property,
          meta: this.meta,
        });
        // render
        const item = this._renderItem(context2);
        // combine
        if (Array.isArray(item)) {
          children = children.concat(item);
        } else {
          children.push(item);
        }
        // next
        index++;
      }
      // set back index
      context.index = index;
      // group
      return this._renderGroupCommon(context, children);
    },
    _getFlattenItemNext(context, index) {
      const { parcel } = context;
      const keys = Object.keys(parcel.properties);
      const key = keys[index + 1];
      if (!key) return null;
      const property = parcel.properties[key];
      if (!property) return null;
      if (property.ebType === 'group' || property.ebType === 'group-flatten') return null;
      // valid
      return { key, property };
    },
    _skipFlattenItems(context) {
      let { index } = context;
      while (true) {
        // next Item
        const flattenItemNext = this._getFlattenItemNext(context, index);
        if (!flattenItemNext) break;
        // next
        index++;
      }
      // set back index
      context.index = index;
    },
  },
};
