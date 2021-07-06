module.exports = (/* ctx*/) => {
  class IOChannelBase {
    async onPush(/* { content, options, message, messageSync, messageClass }*/) {
      return false;
    }
  }
  return IOChannelBase;
};
