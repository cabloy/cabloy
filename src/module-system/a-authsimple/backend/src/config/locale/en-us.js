// subject
const confirmationEmailSubject = '{{siteName}} Account Confirmation';
// body
const confirmationEmailBody =
`
Hi {{userName}},

Welcome to join us. Please click this link to confirm your email:

{{link}}

Regards,
{{siteName}} Team
`;

//
module.exports = {
  confirmationEmailExpired: 'This email confirmation link has expired',
  confirmationEmailSucceeded: 'Your email address has been confirmed',
  confirmationEmailSubject,
  confirmationEmailBody,
};
