module.exports = app => {
  // meta
  const meta = {
    stats: {
      providers: {
        userRed: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: [
            'a-flowtask:taskClaimings',
            'a-flowtask:taskHandlings',
          ],
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
          dependencies: [
            'a-user:userRed',
            'a-user:userOrange',
          ],
        },
      },
    },
  };
  return meta;
};
