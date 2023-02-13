import Actions from './item_actions.jsx';
import ContextMenu from './item_contextMenu.jsx';

export default {
  mixins: [Actions, ContextMenu],
  methods: {
    item_getDetailName(item) {
      return item.detailName;
    },
    item_getMetaSummary(item) {
      return (item._meta && item._meta.summary) || '';
      // return (item._meta && item._meta.summary) || item.detailCode;
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    item_renderMedia(item, index) {
      return <f7-badge>{index + 1}</f7-badge>;
    },
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
  },
};
