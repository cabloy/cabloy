import progressbar from './progressbar.js';

export default function(ctx) {
  // calendar
  const calendar = {
    create(params) {
      ctx.$utils.extend(params, {
        hostEl: ctx.getHostEl(),
      });
      return ctx.$f7.calendar.create(params);
    },
  };
  // toast
  const toast = {
    _toastShowing: null,
    _prepareParams(params) {
      const _params = ctx.$utils.extend({}, params, {
        hostEl: ctx.getHostEl(),
      });
      if (!_params.text) {
        _params.text = ctx.$text('Operation Succeeded');
      }
      return _params;
    },
    create(params) {
      const _params = this._prepareParams(params);
      return ctx.$f7.toast.create(_params);
    },
    show(params) {
      // params
      const _params = this._prepareParams(params);
      // _toastShowing only for .show(except .create)
      if (this._toastShowing && !this._toastShowing.destroyed && this._toastShowing.__eb_text === _params.text) {
        // do nothing
        return this._toastShowing;
      }
      this._toastShowing = ctx.$f7.toast.show(_params);
      this._toastShowing.__eb_text = _params.text;
      // ok
      return this._toastShowing;
    },
  };
  // dialog
  const dialog = {};
  // create
  dialog.create = function(params) {
    ctx.$utils.extend(params, {
      hostEl: ctx.getHostEl(),
    });
    return ctx.$f7.dialog.create(params);
  };
  // close
  dialog.close = function() {
    ctx.$f7.dialog.close();
  };
  // preloader / progress
  for (const method of [ 'preloader', 'progress' ]) {
    dialog[method] = function(...args) {
      return ctx.$f7.dialog[method](ctx.getHostEl(), ...args);
    };
  }
  // alert
  dialog.alert = function(text, title) {
    return new Promise((resolve, reject) => {
      ctx.$f7.dialog.alert(ctx.getHostEl(), text, title, () => resolve());
    });
  };
  // prompt
  dialog.prompt = function(text, title) {
    return new Promise((resolve, reject) => {
      ctx.$f7.dialog.prompt(ctx.getHostEl(), text, title, value => resolve(value), value => reject(value));
    });
  };
  // confirm
  dialog.confirm = function(text, title) {
    if (!text) text = ctx.$text('Are you sure to perform this operation?');
    return new Promise((resolve, reject) => {
      ctx.$f7.dialog.confirm(ctx.getHostEl(), text, title, () => resolve(), () => reject());
    });
  };
  // progressbar
  dialog.progressbar = function({ progressId, title, canBreak = true, color, progress = 0 }) {
    return progressbar({ ctx, progressId, title, canBreak, color, progress });
  };

  // ok
  return {
    calendar,
    toast,
    dialog,
  };
}
