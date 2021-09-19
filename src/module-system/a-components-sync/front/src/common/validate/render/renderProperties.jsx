export default {
  methods: {
    renderProperties(context) {
      const { parcel } = context;
      const children = [];
      let domGroupFlattenChildren = null;
      let domGroupFlattenkey = null;
      let domGroupFlattenProperty = null;
      const _closeGroup = () => {
        // group title
        const titleHidden = domGroupFlattenProperty.ebParams && domGroupFlattenProperty.ebParams.titleHidden;
        if (!titleHidden) {
          const props = {
            groupTitle: true,
            title: this.getTitle({
              key: domGroupFlattenkey,
              property: domGroupFlattenProperty,
            }),
          };
          // title
          const groupTitle = <f7-list-item key={domGroupFlattenkey + '_groupTitle'} {...{ props }}></f7-list-item>;
          // combine
          domGroupFlattenChildren.unshift(groupTitle);
        }
        // group
        const className = domGroupFlattenProperty.ebGroupWhole ? 'eb-list-group-whole' : 'eb-list-group';
        const item = (
          <f7-list-group key={domGroupFlattenkey} staticClass={className}>
            {domGroupFlattenChildren}
          </f7-list-group>
        );
        // clear
        domGroupFlattenChildren = null;
        domGroupFlattenkey = null;
        domGroupFlattenProperty = null;
        return item;
      };
      for (const key in parcel.properties) {
        const property = parcel.properties[key];
        const bGroup = property.ebType === 'group';
        const bGroupFlatten = property.ebType === 'group-flatten';
        if ((bGroup || bGroupFlatten) && domGroupFlattenChildren) {
          // close previous group
          children.push(_closeGroup());
        }
        if (bGroupFlatten) {
          // open new group
          domGroupFlattenChildren = [];
          domGroupFlattenkey = key;
          domGroupFlattenProperty = property;
        } else {
          // others
          // context
          const context2 = this.getContext({
            parcel,
            key,
            property,
          });
          // render
          const item = this._renderItem(context2);
          if (item) {
            if (domGroupFlattenChildren) {
              domGroupFlattenChildren.push(item);
            } else {
              children.push(item);
            }
          }
        }
      }
      // close previous group
      if (domGroupFlattenChildren) {
        children.push(_closeGroup());
      }
      // ok
      return children;
    },
  },
};
