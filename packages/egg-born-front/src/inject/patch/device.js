export default function (Vue) {
  // device
  const device = Vue.prototype.$device;
  // host
  device.host = deviceHost();
  device.embed = Object.keys(device.host).length > 0;
}

function deviceHost() {
  const host = {};
  // ua
  const ua = navigator.userAgent.toLowerCase() || '';
  // wxwork
  const wxwork = ua.indexOf('wxwork') > -1;
  if (wxwork) host.wxwork = true;
  // wechat
  const wechat = !wxwork && (ua.indexOf('micromessenger') > -1 || ua.indexOf('micromessage') > -1);
  if (wechat) host.wechat = true;
  // dingtalk
  const dingtalk = ua.indexOf('dingtalk') > -1;
  if (dingtalk) host.dingtalk = true;
  // ok
  return host;
}
