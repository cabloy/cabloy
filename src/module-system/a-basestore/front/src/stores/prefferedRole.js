export default function (Vue) {
  return {
    state() {
      return { preferredRoles: {} };
    },
    created() {
      Vue.prototype.$meta.eventHub.$on('auth:login', data => {
        this.authLogin(data);
      });
    },
    actions: {
      authLogin() {
        this.preferredRoles = {};
      },
      setPrefferedRole({ atomClassId, prefferedRole }) {
        this.preferredRoles[atomClassId] = prefferedRole;
      },
      // undefined: not support
      // null: cancelled by user
      async getPrefferedRoleAndCheck({ ctx, atomClass, options }) {
        const useStoreAtomClasses = await Vue.prototype.$meta.store.use('a/basestore/atomClasses');
        const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
        // check
        const enableRightRoleScopes = atomClassBase.enableRight?.role?.scopes;
        if (!enableRightRoleScopes) {
          return undefined;
        }
        const preferredRole = await this.getPrefferedRole({ ctx, atomClass, options });
        if (!preferredRole) {
          return null;
        }
        return preferredRole;
      },
      async getPrefferedRole({ ctx, atomClassId, options }) {
        if (this.preferredRoles[atomClassId]) return this.preferredRoles[atomClassId];
        // get preferred roles
        const roles = await ctx.$api.post('/a/base/atom/preferredRoles', {
          atomClass: { id: atomClassId },
        });
        // 0/1
        if (roles.length === 0) throw new Error('Error');
        if (roles.length === 1) {
          const preferredRole = roles[0].roleIdWho;
          this.setPrefferedRole({ atomClassId, preferredRole });
          return preferredRole;
        }
        // >1
        const preferredRole = await this._getPrefferedRole_select({ ctx, roles, options });
        if (preferredRole) {
          this.setPrefferedRole({ atomClassId, preferredRole });
        }
        return preferredRole;
      },
      async _getPrefferedRole_select({ ctx, roles, options }) {
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
          targetEl: options.targetEl,
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
}
