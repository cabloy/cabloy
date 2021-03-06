// confirmationEmail
//   subject
const uniformMessageRenderTemplateMailSubject = '[{{info.siteName}}] {{content.title}}';
//   body
const uniformMessageRenderTemplateMailBody =
`
您好，{{user.userName}}，

您收到一条新消息，详情如下：

来自: {{content.issuerName}}
标题: {{content.title}}
正文: {{content.body}}
链接: {{info.link}}

此致，
{{info.siteName}} 团队
`;

module.exports = {
  Messages: '消息',
  Message: '消息',
  uniformMessageRenderTemplateMailSubject,
  uniformMessageRenderTemplateMailBody,
};
