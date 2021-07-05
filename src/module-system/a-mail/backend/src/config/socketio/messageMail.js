module.exports = app => {
  const MessageMail = {
    info: {
      bean: 'mail',
      title: 'Mail',
      persistence: false,
      push: {
        channels: ['a-mail:mail'],
      },
    },
  };
  return MessageMail;
};
