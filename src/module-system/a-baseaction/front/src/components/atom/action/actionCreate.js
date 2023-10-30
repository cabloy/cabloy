export default {
  methods: {
    async _onActionCreate() {
      let { ctx, action, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // atomClassBase
      const useStoreAtomClasses = await ctx.$store.use('a/basestore/atomClasses');
      const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
      // dataOptions
      let dataOptions = action.dataOptions || {};
      // create params
      let params;
      if (dataOptions.createContinue) {
        params = dataOptions.createParams;
      } else {
        params = await this._onActionCreatePrepareParams({ atomClass, atomClassBase, dataOptions, item });
        if (!params) {
          // do nothing
          return;
        }
      }
      // createDelay
      if (action.createDelay && !dataOptions.createContinue) {
        // write
        dataOptions = { ...dataOptions, createDelay: true, createParams: params };
        return await this._onActionCreateContinueWrite({ ctx, action, atomClass, dataOptions, item });
      }
      // create
      let key;
      if (action.createDelay && dataOptions.createContinue) {
        key = { atomId: item.atomId, itemId: item.itemId };
      } else {
        const resCreate = await ctx.$api.post('/a/base/atom/create', params);
        key = resCreate.key;
        item = resCreate.item;
      }
      // event
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, atom: item });
      // menu
      if (!dataOptions.noActionWrite) {
        // write
        const itemWrite = ctx.$utils.extend({}, item, key);
        return await this._onActionCreateContinueWrite({ ctx, action, atomClass, dataOptions, item: itemWrite });
      }
      // just return key
      return key;
    },
    async _onActionCreateContinueWrite({ ctx, action, atomClass, dataOptions, item }) {
      const useStoreAtomActions = await ctx.$store.use('a/basestore/atomActions');
      let actionWrite = await useStoreAtomActions.getActionBase({ atomClass, name: 'write' });
      actionWrite = ctx.$utils.extend({}, actionWrite, { navigateOptions: action.navigateOptions }, { dataOptions });
      return await ctx.$meta.util.performAction({ ctx, action: actionWrite, item });
    },
    async _onActionCreatePrepareParams({ atomClass, atomClassBase, dataOptions, item }) {
      // params
      const params = {
        atomClass,
        item,
        options: {
          returnItem: true,
        },
      };
      // roleIdOwner
      if (!atomClassBase.itemOnly) {
        const enableRightRoleScopes = atomClassBase.enableRight?.role?.scopes;
        if (enableRightRoleScopes) {
          const roleIdOwner = await this._onActionCreateGetRoleIdOwner();
          if (!roleIdOwner) return null;
          params.roleIdOwner = roleIdOwner;
        }
      }
      // options
      this.base_prepareOptionsFromDataOptions(params.options, dataOptions);
      // ok
      return params;
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
