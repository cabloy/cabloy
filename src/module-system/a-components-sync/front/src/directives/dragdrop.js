export default function(dragdrop) {

  return {
    inserted(el, binding) {
      dragdrop.bind(el, binding.value);
    },
    componentUpdated(el, binding) {
      dragdrop.bind(el, binding.value);
    },
    unbind(el) {
      dragdrop.unbind(el);
    },
  };

}
