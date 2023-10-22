module.exports = app => {
  // static
  const staticLayouts = require('./meta/static/layouts.js')(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    stats: {
      providers: {
        userRed: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: ['a-flowtask:taskClaimings', 'a-flowtask:taskHandlings'],
        },
        userOrange: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: [
            'a-base:drafts',
            // 'a-base:stars',
            'a-flow:flowInitiateds',
          ],
        },
        user: {
          user: true,
          bean: {
            module: 'a-user',
            name: 'user',
          },
          // dependencies: ['a-user:userRed', 'a-user:userOrange', 'a-message:message', 'a-base:starsLabels'],
          dependencies: ['a-user:userRed', 'a-user:userOrange'],
        },
        userAlert: {
          user: true,
          bean: {
            module: 'a-user',
            name: 'userAlert',
          },
          dependencies: ['a-user:user'],
        },
      },
    },
  };
  return meta;
};
