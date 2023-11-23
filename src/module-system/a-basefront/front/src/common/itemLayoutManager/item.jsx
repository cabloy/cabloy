import CommonItem from '../common/item.jsx';

export default {
  mixins: [CommonItem],
  methods: {
    item_getAtomStateColor(item) {
      const atomState = String(item.atomState);
      if (['-1'].includes(atomState)) return 'teal';
      if (['-2', '-3'].includes(atomState)) return 'gray';
      return 'orange';
    },
    item_renderFlowNodeState(item) {
      // ignore 0/'0'
      // eslint-disable-next-line
      if (item.atomState != 0 && item._atomStateTitleLocale) {
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
