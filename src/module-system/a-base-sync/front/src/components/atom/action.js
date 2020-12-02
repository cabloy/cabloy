export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate({ ctx, action, item });
      } else if (action.name === 'delete') {
        // delete
        await ctx.$view.dialog.confirm();
        const key = { atomId: item.atomId, itemId: item.itemId };
        await ctx.$api.post('/a/base/atom/delete', { key });
        ctx.$meta.eventHub.$emit('atom:action', { key, action });
        // back
        ctx.$f7router.back();
      } else if (action.name === 'save') {
        // save
        const key = { atomId: item.atomId, itemId: item.itemId };
        await ctx.$api.post('/a/base/atom/write', { key, item });
        ctx.$meta.eventHub.$emit('atom:action', { key, action });
        // toast
        return ctx.$text('Saved');
      } else if (action.name === 'submit') {
        // submit
        await ctx.$view.dialog.confirm();
        const key = { atomId: item.atomId, itemId: item.itemId };
        const data = await ctx.$api.post('/a/base/atom/writeSubmit', { key, item });
        if (data.archive) {
          // delete draft
          ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'delete' } });
          // update archive
          ctx.$meta.eventHub.$emit('atom:action', { key: data.archive.key, action: { name: 'save' } });
          // back
          ctx.$f7router.back();
        } else {
          // flow
          const flow = data.flow;
          // update draft
          ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
          // navigate replace self
          const url = `/a/flowtask/flow?flowId=${flow.id}`;
          ctx.$view.navigate(url, {
            target: '_self',
            reloadCurrent: true,
          });
        }
      } else if (action.name === 'write') {
        // openDraft
        const key = { atomId: item.atomId, itemId: item.itemId };
        const data = await ctx.$api.post('/a/base/atom/openDraft', { key });
        const keyDraft = data.draft.key;
        const _item = {
          ...item,
          atomId: keyDraft.atomId,
          itemId: keyDraft.itemId,
        };
        const url = ctx.$meta.util.replaceTemplate('/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}', _item);
        ctx.$view.navigate(url, action.navigateOptions);
        // event
        if (item.atomStage > 0) {
          ctx.$meta.eventHub.$emit('atom:actions', { key });
        }
      } else if (action.name === 'clone') {
        // clone
        await ctx.$view.dialog.confirm();
        try {
          const key = { atomId: item.atomId, itemId: item.itemId };
          const data = await ctx.$api.post('/a/base/atom/clone', { key });
          const keyDraft = data.draft.key;
          const _item = {
            ...item,
            atomId: keyDraft.atomId,
            itemId: keyDraft.itemId,
          };
          const url = ctx.$meta.util.replaceTemplate('/a/basefront/atom/item?mode=edit&atomId={{atomId}}&itemId={{itemId}}', _item);
          ctx.$view.navigate(url, action.navigateOptions);
        } catch (err) {
          if (err.code === 422) {
            throw new Error(err.message[0].message);
          }
          throw err;
        }
      } else if (action.name === 'history') {
        const atomIdArchive = item.atomStage === 1 ? item.atomId : item.atomIdArchive;
        if (!atomIdArchive) return;
        // options
        const options = {
          where: {
            'a.atomIdArchive': atomIdArchive,
          },
          stage: 'history',
        };
        // params
        const params = {
          pageTitle: `${this.$text('History')}: ${item.atomName}`,
        };
        // queries
        const queries = {
          module: item.module,
          atomClassName: item.atomClassName,
          options: JSON.stringify(options),
          params: JSON.stringify(params),
        };
        const url = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
        ctx.$view.navigate(url, {
          // target: '_self'
        });
      } else if (action.name === 'archive') {
        await this._onActionRead({ ctx, item, atomId: item.atomIdArchive });
      } else if (action.name === 'draft') {
        await this._onActionRead({ ctx, item, atomId: item.atomIdDraft });
      } else if (action.name === 'selectLocale') {
        return await this._onActionSelectLocale({ ctx, action, item });
      }
    },
    async _onActionRead({ ctx, item, atomId }) {
      const actionsAll = await ctx.$store.dispatch('a/base/getActions');
      let actionRead = actionsAll[item.module][item.atomClassName].read;
      actionRead = ctx.$utils.extend({}, actionRead);
      await ctx.$meta.util.performAction({ ctx, action: actionRead, item: { atomId } });
    },
    _onActionCreate({ ctx, action, item }) {
      // get roleIdOwner
      return this._onActionCreateGetRoleIdOwner({ ctx, action, item }).then(roleIdOwner => {
        if (!roleIdOwner) return;
        // create
        return ctx.$api.post('/a/base/atom/create', {
          atomClass: {
            id: item.atomClassId,
            module: item.module,
            atomClassName: item.atomClassName,
          },
          roleIdOwner,
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
            ctx.$store.commit('a/base/setUserAtomClassRolesPreferred', { atomClassId, roleIdOwner });
            return roleIdOwner;
          }
          return this._onActionCreateSelectPreferredRole({ ctx, action, roles }).then(roleIdOwner => {
            if (roleIdOwner) {
              ctx.$store.commit('a/base/setUserAtomClassRolesPreferred', { atomClassId, roleIdOwner });
            }
            return roleIdOwner;
          });
        });
      });
    },
    _onActionCreateSelectPreferredRole({ ctx, action, roles }) {
      return new Promise(resolve => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [{
          text: ctx.$text('AtomClassSelectRoleTip'),
          label: true,
        }];
        let resolved = false;
        function onButtonClick(roleIdOwner) {
          resolved = true;
          resolve(roleIdOwner);
        }
        for (const role of roles) {
          buttons.push({
            text: role.roleNameWho,
            onClick: () => {
              onButtonClick(role.roleIdWho);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            resolve();
          }
        }
        actions.open()
          .once('actionsClosed', onActionsClosed)
          .once('popoverClosed', onActionsClosed);
      });
    },
    async _onActionSelectLocale({ ctx, action, item }) {
      const atomClasses = await ctx.$store.dispatch('a/base/getAtomClasses');
      const atomClass = atomClasses[item.module][item.atomClassName];
      // not support language
      if (!atomClass.language) {
        return null;
      }
      // only one
      const locales = await ctx.$store.dispatch('a/base/getLocales');
      if (locales.length === 1) {
        return locales[0];
      }
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [{
          text: ctx.$text('SelectLanguageTip'),
          label: true,
        }];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const locale of locales) {
          buttons.push({
            text: locale.title,
            onClick: () => {
              onButtonClick(locale);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject();
          }
        }
        actions.open()
          .once('actionsClosed', onActionsClosed)
          .once('popoverClosed', onActionsClosed);
      });
    },
  },
};
