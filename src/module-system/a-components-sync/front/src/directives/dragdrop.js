export default function(dragdrop) {

  return {
    bind(el, binding) {
      dragdrop.bind(el, binding.value);
    },
    update(el, binding) {
      dragdrop.bind(el, binding.value);
    },
    unbind(el) {
      dragdrop.unbind(el);
    },
  };

}
