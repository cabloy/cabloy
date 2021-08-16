export default {
  methods: {
    async _onActionCreate() {
      const { ctx, action, item } = this.$props;
      // get roleIdOwner
      const roleIdOwner = await this._onActionCreateGetRoleIdOwner();
      if (!roleIdOwner) return;
      // create
      const key = await ctx.$api.post('/a/base/atom/create', {
        atomClass: {
          id: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
        },
        roleIdOwner,
        item,
      });
      // event
      ctx.$meta.eventHub.$emit('atom:action', { key, action });
      // menu
      if (action.menu === 1 || action.actionComponent || action.actionPath) {
        const itemWrite = ctx.$utils.extend({}, item, key);
        // write
        const actionsAll = await ctx.$store.dispatch('a/base/getActions');
        let actionWrite = actionsAll[itemWrite.module][itemWrite.atomClassName].write;
        actionWrite = ctx.$utils.extend({}, actionWrite);
        return await ctx.$meta.util.performAction({ ctx, action: actionWrite, item: itemWrite });
      }
      // just return key
      return key;
    },
    async _onActionCreateGetRoleIdOwner() {
      const { ctx } = this.$props;
      const atomClassId = await this._onActionCreateGetAtomClassId();
      // check cache from vuex
      const userAtomClassRolesPreferred = ctx.$store.getState('a/base/userAtomClassRolesPreferred');
      if (userAtomClassRolesPreferred[atomClassId]) return userAtomClassRolesPreferred[atomClassId];
      // get preferred roles
      const roles = await ctx.$api.post('/a/base/atom/preferredRoles', {
        atomClass: { id: atomClassId },
      });
      // 0/1
      if (roles.length === 0) throw new Error('Error');
      if (roles.length === 1) {
        const roleIdOwner = roles[0].roleIdWho;
        ctx.$store.commit('a/base/setUserAtomClassRolesPreferred', { atomClassId, roleIdOwner });
        return roleIdOwner;
      }
      // >1
      const roleIdOwner = await this._onActionCreateSelectPreferredRole({ roles });
      if (roleIdOwner) {
        ctx.$store.commit('a/base/setUserAtomClassRolesPreferred', { atomClassId, roleIdOwner });
      }
      return roleIdOwner;
    },
    async _onActionCreateGetAtomClassId() {
      const { ctx, item } = this.$props;
      if (item.atomClassId) return item.atomClassId;
      const atomClass = await ctx.$api.post('/a/base/atomClass/atomClass', {
        atomClass: {
          module: item.module,
          atomClassName: item.atomClassName,
        },
      });
      return atomClass.id;
    },
    async _onActionCreateSelectPreferredRole({ roles }) {
      const { ctx, action } = this.$props;
      return new Promise(resolve => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('AtomClassSelectRoleTip'),
            label: true,
          },
        ];
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
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
  },
};
