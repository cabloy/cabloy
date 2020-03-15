import widgetBaseFn from './common/widgetBase.js';

export default function(Vue) {
  return {
    ebDashboardWidgetBase: widgetBaseFn(Vue, false),
  };
}
