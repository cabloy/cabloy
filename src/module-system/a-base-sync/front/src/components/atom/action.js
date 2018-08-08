export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action, item }) {
      if (action.menu === 1 && action.action === 'create') {
        // create
        return ctx.$api.post('/a/base/atom/create', {
          atomClass: { id: item.atomClassId },
        }).then(key => {
          ctx.$utils.extend(item, key);
          ctx.$meta.eventHub.$emit('atom:action', { key, action });
        });
      } else if (action.name === 'delete') {
        // delete
        const key = { atomId: item.atomId, itemId: item.itemId };
        return ctx.$view.dialog.confirm().then(() => {
          return ctx.$api.post('/a/base/atom/delete', {
            key,
          }).then(() => {
            ctx.$meta.eventHub.$emit('atom:action', { key, action });
            return true;
          });
        });
      } else if (action.name === 'save') {
        // save
        const key = { atomId: item.atomId, itemId: item.itemId };
        return ctx.$api.post('/a/base/atom/write', {
          key,
          item,
        }).then(() => {
          ctx.$meta.eventHub.$emit('atom:action', { key, action });
        });
      } else if (action.name === 'submit') {
        // submit
        const key = { atomId: item.atomId, itemId: item.itemId };
        return ctx.$view.dialog.confirm().then(() => {
          return ctx.$api.post('/a/base/atom/submit', {
            key,
            item,
          }).then(() => {
            ctx.$meta.eventHub.$emit('atom:action', { key, action });
          });
        });
      }
      // others
      const key = { atomId: item.atomId, itemId: item.itemId };
      return ctx.$view.dialog.confirm().then(() => {
        return ctx.$api.post('/a/base/atom/action', {
          action: action.code,
          key,
        }).then(() => {
          ctx.$meta.eventHub.$emit('atom:action', { key, action });
          return true;
        });
      });

    },
  },
};
