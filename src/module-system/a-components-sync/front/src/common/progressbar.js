export default function({ ctx, progressId, title, canAbort = true }) {
  return new Promise((resolve, reject) => {
    const action = {
      actionModule: 'a-socketio',
      actionComponent: 'io',
      name: 'instance',
    };
    ctx.$meta.util.performAction({ ctx, action }).then(io => {
      _progressbar({ io, ctx, progressId, title, canAbort, resolve, reject });
    });
  });
}

function _progressbar({ io, ctx, progressId, title, canAbort, resolve, reject }) {
  let dialog;
  let counter = 0;
  const app = ctx.$f7;
  const hostEl = ctx.getHostEl();
  const subscribePath = `/a/progress/update/${progressId}`;
  // buttons
  const buttons = [];
  if (canAbort) {
    buttons.push({
      text: ctx.$text('Abort'),
      keyCodes: [ 27 ],
    });
  }
  //
  function callbackBreak() {
    ctx.dialog.confirm().then(() => {
      return ctx.$api.post('/a/progress/progress/abort', {
        progressId,
      }).then(() => {});
    }).catch(() => {
      dialog.open();
    });
  }
  function setProgresses(list) {
    // adjust progressbar
    prepareProgressbars(list.length);
    // setProgress
    for (const progressNo in list) {
      const _item = list[progressNo];
      setProgress({
        progressNo,
        total: _item.total,
        progress: _item.progress,
        text: _item.text,
      });
    }
  }
  //
  function setProgress({ progressNo = 0, total = 0, progress = 0, text = '' }) {
    // prepare progressbar
    const progressbars = dialog.$el.find('.progressbar-item');
    const progressbar = ctx.$$(progressbars[progressNo]);
    // setProgress
    const _progress = total > 0 ? parseInt(progress * 100 / total) : progress;
    app.progressbar.set(progressbar.find('.progressbar'), _progress);
    // set text
    const _text = total > 0 ? `(${progress + 1}/${total}) ${text}` : text;
    const $textEl = progressbar.find('.progressbar-text');
    $textEl.text(_text);
  }
  //
  function prepareProgressbars(length) {
    const progressbars = dialog.$el.find('.progressbar-item');
    if (progressbars.length > length) {
      // remove
      for (let i = progressbars.length - 1; i > length - 1; i--) {
        progressbars[i].remove();
      }
    } else if (progressbars.length < length) {
      const container = dialog.$el.find('.progressbar-container');
      for (let i = 0; i < length - progressbars.length; i++) {
        const progressbar = ctx.$$(`
                <div class="progressbar-item">
                  <div class="progressbar">
                    <span></span>
                  </div>
                  <div class="progressbar-text"></div>
                <div>
        `);
        container.append(progressbar);
      }
    }
  }
  //
  function checking(item) {
    if (!item) return;
    if (item.counter > counter) {
      counter = item.counter;
    }
    const data = item.data ? (typeof item.data === 'string' ? JSON.parse(item.data) : item.data) : {};
    if (item.done === 0) {
      setProgresses(data);
    } else if (item.done === -1) {
      // done:1 error:-1
      // force close and destroy
      dialog.close();
      onDestroy();
      // alert
      // ctx.toast.show({ text: data.message });
      // reject
      reject(data);
    } else if (item.done === 1) {
      // alert
      const progress = { total: 0, progress: 100, text: data.message || ctx.$text('Operation Succeeded') };
      setProgresses([ progress ]);
      // hide buttons
      dialog.$el.find('.dialog-buttons').hide();
      // close
      window.setTimeout(() => {
        dialog.close();
        onDestroy();
      }, app.params.toast.closeTimeout);
      // resolve
      resolve(data);
    }
  }
  //
  function onDestroy() {
    // delete progress
    ctx.$api.post('/a/progress/progress/delete', {
      progressId,
    }).then(() => {
      // donothing
    }).catch(() => {
      // donothing
    });
    // destroy
    setTimeout(() => {
      dialog.destroy();
    }, 0);
  }
  //
  function onMessage({ message }) {
    const item = JSON.parse(message.content);
    checking(item);
  }
  //
  function onSubscribed() {
    ctx.$api.post('/a/progress/progress/check', {
      progressId, counter,
    }).then(item => {
      checking(item);
    }).catch(() => {
      // donothing
    });
  }
  // socket io
  io.subscribe(subscribePath, onMessage, onSubscribed);
  // dialog
  dialog = app.dialog.create({
    hostEl,
    title: typeof title === 'undefined' ? app.params.dialog.progressTitle : title,
    cssClass: 'dialog-progress',
    content: `
              <div class="progressbar-container">
              </div>
            `,
    buttons,
    onClick(dialog, index) {
      if (index === 0) callbackBreak();
    },
    destroyOnClose: false,
  });
  // open
  return dialog.open();
}
