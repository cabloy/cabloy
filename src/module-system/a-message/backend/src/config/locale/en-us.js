// confirmationEmail
//   subject
const uniformMessageRenderTemplateMailSubject = '[{{info.siteName}}] {{content.title}}';
//   body
const uniformMessageRenderTemplateMailBody = `
Hi {{user.userName}},

You have received a new message. Here are the details:

From: {{content.issuerName}}
Title: {{content.title}}
Body: {{content.body}}
Link: {{info.link}}

Regards,
{{info.siteName}} Team
`;

module.exports = {
  uniformMessageRenderTemplateMailSubject,
  uniformMessageRenderTemplateMailBody,
};
