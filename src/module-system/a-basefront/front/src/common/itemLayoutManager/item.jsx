export default {
  methods: {
    item_getAtomStateColor(item) {
      return item.atomClosed === 0 ? 'orange' : 'gray';
    },
    item_renderFlowNodeState(item) {
      if (item._atomStateTitleLocale) {
        const color = this.item_getAtomStateColor(item);
        return (
          <f7-badge key="_atomStateTitleLocale" color={color}>
            {item._atomStateTitleLocale}
          </f7-badge>
        );
      }
      return null;
    },
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      // flow
      const domFlowNodeState = this.item_renderFlowNodeState(item);
      if (domFlowNodeState) {
        domMetaFlags.push(domFlowNodeState);
      }
      // flags
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
  },
};
