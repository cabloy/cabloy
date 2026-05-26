// confirmationEmail
//   subject
export const ConfirmationEmailSubject = '[{{siteName}}] 账号确认';
//   body
export const ConfirmationEmailBody = `
您好，{{userName}}，

欢迎加入我们。请点击以下链接验证您的邮件：

{{link}}

此致，
{{siteName}} 团队
`;

// passwordResetEmail
//   subject
export const PasswordResetEmailSubject = '[{{siteName}}] 重置密码';
//   body
export const PasswordResetEmailBody = `
您好，{{userName}}，

请点击以下链接重置密码：

{{link}}

此致，
{{siteName}} 团队
`;
