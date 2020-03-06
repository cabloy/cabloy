export default function(Vue) {
  return {
    bind(el, binding, vnode) {
      const $el = Vue.prototype.$$(el);
      const app = Vue.prototype.$f7;
      const support = Vue.prototype.$Framework7.support;
      const passive = support.passiveListener ? { passive: true } : false;

      el.__dragdrop_handeTouchStart = handeTouchStart.bind(el);
      el.__dragdrop_handeTouchMove = handeTouchMove.bind(el);
      el.__dragdrop_handeTouchEnd = handeTouchEnd.bind(el);


      $el.on(app.touchEvents.start, el, el.__dragdrop_handeTouchStart, passive);
      app.on('touchmove:active', el.__dragdrop_handeTouchMove);
      app.on('touchend:passive', el.__dragdrop_handeTouchEnd);
    },
    unbind(el) {
      const $el = Vue.prototype.$$(el);
      const app = Vue.prototype.$f7;
      const support = Vue.prototype.$Framework7.support;
      const passive = support.passiveListener ? { passive: true } : false;

      $el.off(app.touchEvents.start, el, el.__dragdrop_handeTouchStart, passive);
      app.off('touchmove:active', el.__dragdrop_handeTouchMove);
      app.off('touchend:passive', el.__dragdrop_handeTouchEnd);

      el.__dragdrop_handeTouchStart = null;
      el.__dragdrop_handeTouchMove = null;
      el.__dragdrop_handeTouchEnd = null;
    },
  };
}


function handeTouchStart(e) {
  console.log(e, this);
}

function handeTouchMove(e) {

}

function handeTouchEnd(e) {

}
