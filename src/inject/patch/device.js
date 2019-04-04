export default function(Vue) {
  // device
  const device = Vue.prototype.$device;
  // wechat
  const ua = navigator.userAgent.toLowerCase();
  device.wechat = ua && (ua.indexOf('micromessenger') > -1 || ua.indexOf('micromessage') > -1);
}
