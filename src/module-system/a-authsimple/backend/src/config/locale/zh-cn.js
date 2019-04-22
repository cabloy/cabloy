// confirmationEmail
//   subject
const confirmationEmailSubject = '{{siteName}} 账号确认';
//   body
const confirmationEmailBody =
`
您好，{{userName}}，

欢迎加入我们。请点击以下链接验证您的邮件：

{{link}}

此致，
{{siteName}} 团队
`;

// passwordResetEmail
//   subject
const passwordResetEmailSubject = '{{siteName}}重置密码';
//   body
const passwordResetEmailBody =
`
您好，{{userName}}，

请点击以下链接重置密码：

{{link}}

此致，
{{siteName}} 团队
`;

module.exports = {
  Close: '关闭',
  'User/Password': '用户/密码',
  'Authentication failed': '认证失败',
  'User is disabled': '用户被禁用',
  'Auth-Simple': '认证-简单',
  'Reset password': '重置密码',
  'Element exists': '元素已存在',
  'Cannot contain __': '不能包含__',
  'Resend confirmation email': '重新发送确认邮件',
  'Email address does not exist': '邮件地址不存在',
  confirmationEmailExpired: '确认邮件链接已经过期',
  confirmationEmailSucceeded: '您的邮件地址已经确认',
  confirmationEmailSubject,
  confirmationEmailBody,
  passwordResetEmailExpired: '重置密码链接已经过期',
  passwordResetEmailSubject,
  passwordResetEmailBody,
};
