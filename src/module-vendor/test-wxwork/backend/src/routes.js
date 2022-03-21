module.exports = app => {
  const routes = [
    // test
    {
      method: 'post',
      path: 'test/getMemberId',
      controller: 'test',
    },
    {
      method: 'post',
      path: 'test/sendAppMessage',
      controller: 'test',
    },
  ];
  return routes;
};
