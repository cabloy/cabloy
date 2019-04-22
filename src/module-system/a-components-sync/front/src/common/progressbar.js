export default function({ ctx, progressId, title, canBreak = true, color, progress = 0 }) {
  const app = ctx.$f7;
  const hostEl = ctx.getHostEl();
  const infinite = typeof progress === 'undefined';
  const dialog = app.dialog.create({
    hostEl,
    title: typeof title === 'undefined' ? app.params.dialog.progressTitle : title,
    cssClass: 'dialog-progress',
    content: `
              <div class="progressbar${infinite ? '-infinite' : ''}${color ? ` color-${color}` : ''}">
                ${!infinite ? '<span></span>' : ''}
              </div>
              <div class="progressbar-text"></div>
            `,
    buttons: [
      {
        text: ctx.$text('Break'),
        keyCodes: [ 27 ],
      },
    ],
    onClick(dialog, index) {
      if (index === 0) callbackBreak({ ctx, progressId, dialog });
    },
    destroyOnClose: false,
  });
  // setProgress
  dialog.setProgress = function(ops) {
    let progress;
    let text;
    if (typeof ops === 'object') {
      ({ progress, text } = ops);
    } else {
      progress = ops;
    }
    // setProgress
    app.progressbar.set(dialog.$el.find('.progressbar'), progress);
    // set text
    const $textEl = dialog.$el.find('.progressbar-text');
    $textEl.text(text || '');
    // ok
    return dialog;
  };
  // init
  if (!infinite) dialog.setProgress(progress);
  return dialog.open();
}

function callbackBreak({ ctx, progressId, dialog }) {
  ctx.dialog.confirm().then(() => {
    dialog.close();
    dialog.destroy();
  }).catch(() => {
    dialog.open();
  });
}

