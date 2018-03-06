export default function(Vue) {
  // modal
  function patch(modal) {

  }
  // use
  Vue.prototype.$Framework7.Modal.use({
    create() {
      patch(this);
    },
  });
}
