// subject
const confirmationEmailSubject = '{{siteName}} 账号确认';
// body
const confirmationEmailBody =
`
您好，{{userName}}，

欢迎加入我们。请点击以下链接验证您的邮件：

{{link}}

此致，
{{siteName}} 团队
`;

module.exports = {
  Close: '关闭',
  'Authentication failed': '认证失败',
  'User is disabled': '用户被禁用',
  'Auth-Simple': '认证-简单',
  'Reset password': '重置密码',
  'Element exists': '元素已存在',
  'Cannot contain __': '不能包含__',
  'Resend confirmation email': '重新发送确认邮件',
  confirmationEmailExpired: '确认邮件链接已经过期',
  confirmationEmailSucceeded: '您的邮件地址已经确认',
  confirmationEmailSubject,
  confirmationEmailBody,
};
