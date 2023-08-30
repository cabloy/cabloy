export default function (ctx) {
  const actions = {
    _prepareParams(params) {
      const _params = ctx.$utils.extend({}, params, {
        hostEl: ctx.getHostEl && ctx.getHostEl(),
      });
      return _params;
    },
    _prepareButtons(buttons, cb) {
      const buttonArray = [];
      for (const button of buttons) {
        if (Array.isArray(button)) {
          // group
          const _buttons = this._prepareButtons(button, cb);
          buttonArray.push(_buttons);
        } else {
          // button
          if (button.label || button.disabled) {
            buttonArray.push(button);
          } else {
            const _button = ctx.$utils.extend({}, button, {
              onClick: () => {
                cb(button);
              },
            });
            buttonArray.push(_button);
          }
        }
      }
      return buttonArray;
    },
    // params: forceToPopover, targetEl, buttons
    choose(params) {
      // params
      const _params = this._prepareParams(params);
      return new Promise((resolve, reject) => {
        // resolved
        let resolved = false;
        // buttons
        _params.buttons = this._prepareButtons(_params.buttons, button => {
          if (!resolved) {
            resolved = true;
            resolve(button);
          }
        });
        const actions = ctx.$f7.actions.create(_params);
        const onActionsClosed = function () {
          window.setTimeout(() => {
            actions.destroy();
          }, 0);
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        };
        actions.once('modalClosed', onActionsClosed);
        actions.open();
      });
    },
  };
  return actions;
}
