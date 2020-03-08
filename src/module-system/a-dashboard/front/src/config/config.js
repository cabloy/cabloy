export default {
  profile: {
    default: {
      widgets: [
        {
          module: 'test-party', name: 'widgetProducts',
          id: '1',
          properties: {
            width: { small: 100, medium: 50, large: 50 },
            height: 'auto',
          },
        },
        {
          module: 'test-party', name: 'widgetAbout',
          id: '2',
          properties: {
            width: { small: 100, medium: 50, large: 50 },
            height: 'auto',
          },
        },
      ],
    },
  },
};
