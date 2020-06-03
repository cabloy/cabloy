
async function onCheck({ io, ctx, path, message, options, user }) {
  // not check only for test
  return true;
}

async function onSessionId({ io, ctx, path, message, options, user }) {
  // donothing
}

async function onGroupUsers({ io, ctx, path, message, options, user }) {
  // donothing
}

async function onProcess({ io, ctx, path, options, message, groupUsers, messageClass }) {
  // donothing
}

async function onDelivery({ io, ctx, path, options, message, messageSync, messageClass }) {
  // options
  const messageScene = (options && options.scene) || '';
  // send back
  if (messageSync.messageDirection === 2 && messageSync.userId === 0) {
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
  // emit
  await io.delivery({ path, options, message, messageSync, messageClass });
}

async function onChannelValid({ io, ctx, options, message, messageSync, messageClass }) {

}

module.exports = app => {
  const test = {
    info: {
      title: 'Test',
      persistence: true,
      push: {
        channelsSupported: '', // empty(means all) / array
        channels: 'auto', // empty(means disable) / auto(auto fetch first valid one) / array(use valid items)
      },
    },
    callbacks: {
      onCheck,
      onSessionId,
      onGroupUsers,
      onProcess,
      onDelivery,
      onChannelValid,
    },
  };
  return test;
};
