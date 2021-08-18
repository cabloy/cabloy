export default function (ctx) {
  const calendar = {
    create(params) {
      ctx.$utils.extend(params, {
        hostEl: ctx.getHostEl(),
      });
      return ctx.$f7.calendar.create(params);
    },
  };
  return calendar;
}
