export default {
  methods: {
    renderProperties(context) {
      const { parcel } = context;
      let children = [];
      const keys = Object.keys(parcel.properties);
      const count = keys.length;
      let index = 0;
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
        // next
        index = context2.index + 1;
      }
      // ok
      return children;
    },
  },
};
