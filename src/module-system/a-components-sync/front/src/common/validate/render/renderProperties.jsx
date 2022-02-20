export default {
  methods: {
    renderProperties(context) {
      const { parcel } = context;
      // children
      let children = [];
      // index
      const keys = Object.keys(parcel.properties);
      const count = keys.length;
      let index = 0;
      // groupCount
      let groupCount = 0;
      while (index < count) {
        const key = keys[index];
        const property = parcel.properties[key];
        // context
        const context2 = this.getContext({
          parcel,
          key,
          property,
          meta: this.meta,
          index,
          groupCount,
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
        children.push(this.renderGroupEmpty());
      }
      // ok
      return children;
    },
  },
};
