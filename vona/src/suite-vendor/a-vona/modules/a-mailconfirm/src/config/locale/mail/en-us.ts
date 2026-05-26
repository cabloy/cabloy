// confirmationEmail
//   subject
export const ConfirmationEmailSubject = '[{{siteName}}] Account Confirmation';
//   body
export const ConfirmationEmailBody = `
Hi {{userName}},

Welcome to join us. Please click this link to confirm your email:

{{link}}

Regards,
{{siteName}} Team
`;

// passwordResetEmail
//   subject
export const PasswordResetEmailSubject = '[{{siteName}}] Password Reset';
//   body
export const PasswordResetEmailBody = `
Hi {{userName}},

To reset your password, visit the following address:

{{link}}

Regards,
{{siteName}} Team
`;
