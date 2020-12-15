module.exports = app => {
  // meta
  const meta = {
    stats: {
      providers: {
        userRed: {
          user: true,
          bean: 'userRed',
          dependencies: [
            'a-flowtask:taskClaimings',
            'a-flowtask:taskHandlings',
          ],
        },
        userOrange: {
          user: true,
          bean: 'userOrange',
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
