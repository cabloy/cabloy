export default function(Vue) {
  const login = {
    open(routeTo) {
      const root = Vue.prototype.$f7.root[0].__vue__;
      root.openView('login', routeTo);
    },
  };
  return login;
}
