export default function (Vue) {
  return {
    state() {
      return { userAtomClassRolesPreferred: {} };
    },
    created() {
      Vue.prototype.$meta.eventHub.$on('auth:login', data => {
        this.authLogin(data);
      });
    },
    actions: {
      authLogin() {
        this.userAtomClassRolesPreferred = {};
      },
      setUserAtomClassRolesPreferred({ atomClassId, roleIdOwner }) {
        this.userAtomClassRolesPreferred[atomClassId] = roleIdOwner;
      },
    },
  };
}
