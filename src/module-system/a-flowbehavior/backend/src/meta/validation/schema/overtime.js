const schemas = {};
// overtime
schemas.overtime = {
  type: 'object',
  properties: {
    cancelActivity: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'OverTime_CancelActivity',
    },
    timeDuration: {
      type: 'number',
      ebType: 'text',
      ebTitle: 'OverTime_TimeDuration',
    },
    timeDate: {
      type: ['object', 'null'],
      ebType: 'datePicker',
      ebTitle: 'OverTime_TimeDate',
      ebParams: {
        timePicker: true,
        dateFormat: 'YYYY-MM-DD HH:mm:00',
        header: false,
        toolbar: true,
      },
      'x-date': true,
    },
  },
};
module.exports = schemas;
