export default {
  bind(el, binding, vnode) {
    const tag = vnode.componentOptions.tag;
    // event
    let events;
    if (tag === 'f7-input') {
      const onChange = function(event) {
        vnode.context.$meta.util.setProperty(vnode.context, binding.expression, event.target.value);
      };
      events = {
        input: onChange,
        change: onChange,
      };
    } else if (tag === 'f7-toggle') {
      const onChange = function(event) {
        vnode.context.$meta.util.setProperty(vnode.context, binding.expression, event.target.checked);
      };
      events = {
        change: onChange,
      };
    } else if (tag === 'f7-radio') {
      const onChange = function(event) {
        vnode.context.$meta.util.setProperty(vnode.context, binding.expression, event.target.value);
      };
      events = {
        change: onChange,
      };
    }
    // attach events
    if (events) {
      for (const event in events) {
        vnode.componentInstance.$on(event, events[event]);
      }
    }
  },
};
