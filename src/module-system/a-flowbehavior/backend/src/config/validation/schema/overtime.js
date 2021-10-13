module.exports = app => {
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
          dateFormat: 'YYYY-MM-DD',
          header: false,
          toolbar: false,
        },
        'x-date': true,
      },
    },
  };
  return schemas;
};
