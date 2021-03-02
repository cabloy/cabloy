// confirmationEmail
//   subject
const uniformMessageRenderTemplateMailSubject = '[{{siteName}}] {{title}}';
//   body
const uniformMessageRenderTemplateMailBody =
`
Hi {{userName}},

Welcome to join us. Please click this link to confirm your email:

{{link}}

Regards,
{{siteName}} Team
`;

module.exports = {
  uniformMessageRenderTemplateMailSubject,
  uniformMessageRenderTemplateMailBody,
};
