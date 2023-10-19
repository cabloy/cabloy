export default {
  methods: {
    _renderGroupCommon(context, children, groupWhole) {
      const { key, property } = context;
      // title
      const titleHidden = property.ebParams && property.ebParams.titleHidden;
      if (!titleHidden) {
        const group = (
          <f7-list-item key={key + '_groupTitle'} groupTitle={true} title={this.getTitle(context)}></f7-list-item>
        );
        // combine
        children.unshift(group);
      }
      // group
      // const ebGroupWhole = this._renderGroupCommon_patchGroupWhole(context);
      const className = groupWhole ? 'eb-list-group-whole' : 'eb-list-group';
      const group = (
        <f7-list-group key={key} staticClass={className}>
          {children}
        </f7-list-group>
      );
      if (!groupWhole) {
        context.groupCount++;
        return group;
      }
      if (context.groupCount % 2 === 0) {
        context.groupCount += 2;
        return group;
      }
      context.groupCount += 3;
      return [this.renderGroupEmpty(), group];
    },
    _renderGroupCommon_patchGroupWhole(context) {
      const { property } = context;
      const ebGroupWhole = property.ebGroupWhole;
      if (ebGroupWhole || context.groupCount % 2 === 1) {
        return ebGroupWhole;
      }
      // check next group
      const groupNext = this._renderGroupCommon_getNextGroup(context);
      return !groupNext || groupNext.property.ebGroupWhole;
    },
    _renderGroupCommon_getNextGroup(context) {
      let { parcel, index } = context;
      const keys = Object.keys(parcel.properties);
      while (true) {
        index++;
        const key = keys[index];
        if (!key) break;
        const property = parcel.properties[key];
        if (!property) break;
        if (property.ebType === 'group' || property.ebType === 'group-flatten') {
          return { key, property };
        }
        // next
      }
      return null;
    },
  },
};
