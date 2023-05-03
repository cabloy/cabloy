export default {
  methods: {
    async _onActionCreate() {
      const { ctx, action, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // atomClassBase
      const atomClassBase = await ctx.$store.dispatch('a/base/getAtomClassBase', { atomClass });
      // dataOptions
      let dataOptions = action.dataOptions || {};
      // createDelay
      if (action.createDelay && !dataOptions.createContinue) {
        // write
        dataOptions = { ...dataOptions, createDelay: true };
        let actionWrite = await ctx.$store.dispatch('a/base/getActionBase', { atomClass, name: 'write' });
        actionWrite = ctx.$utils.extend({}, actionWrite, { navigateOptions: action.navigateOptions }, { dataOptions });
        return await ctx.$meta.util.performAction({ ctx, action: actionWrite, item });
      }
      // get roleIdOwner
      let roleIdOwner;
      if (!atomClassBase.itemOnly) {
        const enableRightRoleScopes = atomClassBase.enableRight?.role?.scopes;
        if (enableRightRoleScopes) {
          roleIdOwner = await this._onActionCreateGetRoleIdOwner();
          if (!roleIdOwner) return;
        }
      }
      // params
      const params = {
        atomClass,
        roleIdOwner,
        item,
        options: {
          returnAtom: true,
        },
      };
      if (dataOptions.atomIdMain) {
        params.options.atomIdMain = dataOptions.atomIdMain;
      }
      // create
      const { key, atom } = await ctx.$api.post('/a/base/atom/create', params);
      // event
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, atom });
      // menu
      if (!dataOptions.noActionWrite) {
        const itemWrite = ctx.$utils.extend({}, item, key);
        // write
        let actionWrite = await ctx.$store.dispatch('a/base/getActionBase', { atomClass, name: 'write' });
        actionWrite = ctx.$utils.extend({}, actionWrite, { navigateOptions: action.navigateOptions }, { dataOptions });
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
      // buttons
      const buttons = [
        {
          text: ctx.$text('AtomClassSelectRoleTip'),
          label: true,
        },
      ];
      for (const role of roles) {
        buttons.push({
          text: role.roleNameWho,
          data: role,
        });
      }
      // choose
      const params = {
        targetEl: action.targetEl,
        buttons,
      };
      try {
        const button = await ctx.$view.actions.choose(params);
        return button.data.roleIdWho;
      } catch (err) {
        return null;
      }
    },
  },
};
