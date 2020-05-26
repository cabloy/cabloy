
async function onPublish({ ctx, path, message, options, user }) {
  // donothing
}

module.exports = app => {
  const test = {
    info: {
      title: 'Test',
    },
    callbacks: {
      onPublish,
    },
  };
  return test;
};
