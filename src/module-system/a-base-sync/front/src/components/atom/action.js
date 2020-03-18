export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action, item }) {
      if (action.name === 'create' || action.action === 'create') {
        return this._onActionCreate({ ctx, action, item });
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
    _onActionCreate({ ctx, action, item }) {
      // get roleIdOwner
      return this._onActionCreateGetRoleIdOwner({ ctx, action, item }).then(roleIdOwner => {
        // create
        item.roleIdOwner = roleIdOwner;
        return ctx.$api.post('/a/base/atom/create', {
          atomClass: {
            id: item.atomClassId,
            module: item.module,
            atomClassName: item.atomClassName,
          },
          item,
        }).then(key => {
        // event
          ctx.$meta.eventHub.$emit('atom:action', { key, action });
          // menu
          if (action.menu === 1 || (action.actionComponent || action.actionPath)) {
            item = ctx.$utils.extend({}, item, key);
            // write
            return ctx.$store.dispatch('a/base/getActions').then(actionsAll => {
              let actionWrite = actionsAll[item.module][item.atomClassName].write;
              actionWrite = ctx.$utils.extend({}, actionWrite);
              return ctx.$meta.util.performAction({ ctx, action: actionWrite, item });
            });
          }
          // just return key
          return key;
        });
      });
    },
    _onActionCreateGetAtomClassId({ ctx, action, item }) {
      if (item.atomClassId) return Promise.resolve(item.atomClassId);
      return ctx.$api.post('/a/base/atomClass/atomClass', {
        atomClass: {
          module: item.module,
          atomClassName: item.atomClassName,
        },
      }).then(atomClass => {
        return atomClass.id;
      });
    },
    _onActionCreateSelectPreferredRole({ ctx, roles }) {

    },
    _onActionCreateGetRoleIdOwner({ ctx, action, item }) {
      return this._onActionCreateGetAtomClassId({ ctx, action, item }).then(atomClassId => {
        // check cache from vuex
        const userAtomClassRolesPreferred = ctx.$store.getState('a/base/userAtomClassRolesPreferred');
        if (userAtomClassRolesPreferred[atomClassId]) return userAtomClassRolesPreferred[atomClassId];
        // get preferred roles
        return ctx.$api.post('/a/base/atom/preferredRoles', {
          atomClass: { id: atomClassId },
        }).then(roles => {
          if (roles.length === 0) return Promise.reject(new Error('Error'));
          if (roles.length === 1) {
            const roleIdOwner = roles[0].roleIdWho;
            ctx.$store.commit('/a/base/atom/setUserAtomClassRolesPreferred', { atomClassId, roleIdOwner });
            return roleIdOwner;
          }
          return this._onActionCreateSelectPreferredRole({ ctx, roles });
        });
      });
    },
  },
};
