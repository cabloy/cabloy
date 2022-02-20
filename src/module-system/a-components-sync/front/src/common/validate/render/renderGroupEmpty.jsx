export default {
  methods: {
    renderGroupEmpty() {
      return <div class="eb-list-group list-group"></div>;
    },
    _renderGroupCommon(context, children) {
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
      const className = property.ebGroupWhole ? 'eb-list-group-whole' : 'eb-list-group';
      return (
        <f7-list-group key={key} staticClass={className}>
          {children}
        </f7-list-group>
      );
    },
  },
};
