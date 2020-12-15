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
            'a-base:stars',
            'a-flow:flowInitiateds',
          ],
        },
      },
    },
  };
  return meta;
};
