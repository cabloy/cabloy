
async function onPublish({ io, ctx, path, message, options, user }) {
  // donothing
}

async function onProcess({ io, path, options, message, messageSync, messageClass }) {
  // options
  const messageScene = (options && options.scene) || '';
  // ignore self
  if (message.userIdFrom === messageSync.userId) return;
  // send back
  if (messageSync.userId === 0) {
    const content = JSON.parse(message.content);
    const _message = {
      messageType: message.messageType,
      messageFilter: message.messageFilter,
      messageGroup: message.messageGroup,
      messageScene,
      userIdTo: message.userIdFrom,
      content: {
        text: `Reply: ${content.text}`,
      },
    };
    return await io.publish({ path, message: _message, messageClass, options, user: { id: 0 } });
  }
  // send by socket


}

module.exports = app => {
  const test = {
    info: {
      title: 'Test',
    },
    callbacks: {
      onPublish,
      onProcess,
    },
  };
  return test;
};
