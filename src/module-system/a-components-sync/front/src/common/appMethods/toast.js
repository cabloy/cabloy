export default function (ctx) {
  const toast = {
    _toastShowing: null,
    _prepareParams(params) {
      const _params = ctx.$utils.extend(
        {
          closeButton: true,
        },
        params,
        {
          hostEl: ctx.getHostEl(),
        }
      );
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
  return toast;
}
