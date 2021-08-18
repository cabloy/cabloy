export default function trimMessage(ctx, message) {
  if (!message || typeof message !== 'string') return message;
  const locale = ctx.$meta.util.getLocale();
  const configComponents = ctx.$meta.config.modules['a-components'];
  const maxLengths = configComponents.error.message.maxLength;
  const maxLength = maxLengths[locale] || maxLengths.default;
  if (message.length >= maxLength) return `${message.substr(0, maxLength)}...`;
  return message;
}
