export default function (Vue) {
  window.addEventListener('beforeunload', event => {
    const dirty = Vue.prototype.$meta.vueLayout.onbeforeunload();
    if (!dirty) return;
    const message = Vue.prototype.$text('PageDirtyQuitConfirm');
    event.returnValue = message;
    return message;
  });
}
