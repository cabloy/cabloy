import Calendar from './appMethods/calendar.js';
import Toast from './appMethods/toast.js';
import Dialog from './appMethods/dialog.js';
import Actions from './appMethods/actions.js';

export default function (ctx) {
  // calendar
  const calendar = Calendar(ctx);
  // toast
  const toast = Toast(ctx);
  // dialog
  const dialog = Dialog(ctx);
  // actions
  const actions = Actions(ctx);
  // ok
  return {
    calendar,
    toast,
    dialog,
    actions,
  };
}
