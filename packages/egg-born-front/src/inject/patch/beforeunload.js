export default function (Vue) {
  window.addEventListener('beforeunload', event => {
    const message = Vue.prototype.$meta.vueLayout.onbeforeunload();
    if (!message) return;
    event.returnValue = message;
    return message;
  });
}
