export default {
  message: 'Hello World',
  markCount: 2,
  monkeyed: false,
  atoms: {
    party: {
      render: {
        list: {
          info: {
            orders: [
              { name: 'personCount', title: 'Person Count', by: 'asc' },
            ],
          },
          layouts: {
            list: {
              blocks: {
                // title: false,
              },
            },
          },
        },
      },
    },
  },
};
