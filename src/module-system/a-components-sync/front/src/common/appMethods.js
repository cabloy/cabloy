import Calendar from './appMethods/calendar.js';
import Toast from './appMethods/toast.js';
import Dialog from './appMethods/dialog.js';

export default function (ctx) {
  // calendar
  const calendar = Calendar(ctx);
  // toast
  const toast = Toast(ctx);
  // dialog
  const dialog = Dialog(ctx);
  // ok
  return {
    calendar,
    toast,
    dialog,
  };
}
