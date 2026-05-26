import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

export type TypeMailTransportService =
  | 'test'
  | '1und1'
  | '126'
  | '163'
  | 'Aliyun'
  | 'AliyunQiye'
  | 'AOL'
  | 'Aruba'
  | 'Bluewin'
  | 'BOL'
  | 'DebugMail'
  | 'Disroot'
  | 'DynectEmail'
  | 'ElasticEmail'
  | 'Ethereal'
  | 'FastMail'
  | 'Feishu Mail'
  | 'Forward Email'
  | 'GandiMail'
  | 'Gmail'
  | 'GMX'
  | 'Godaddy'
  | 'GodaddyAsia'
  | 'GodaddyEurope'
  | 'hot.ee'
  | 'Hotmail'
  | 'iCloud'
  | 'Infomaniak'
  | 'KolabNow'
  | 'Loopia'
  | 'Loops'
  | 'mail.ee'
  | 'Mail.ru'
  | 'Mailcatch.app'
  | 'Maildev'
  | 'MailerSend'
  | 'Mailgun'
  | 'Mailjet'
  | 'Mailosaur'
  | 'Mailtrap'
  | 'Mandrill'
  | 'Naver'
  | 'OhMySMTP'
  | 'One'
  | 'OpenMailBox'
  | 'Outlook365'
  | 'Postmark'
  | 'Proton'
  | 'qiye.aliyun'
  | 'QQ'
  | 'QQex'
  | 'Resend'
  | 'Runbox'
  | 'SendCloud'
  | 'SendGrid'
  | 'SendinBlue'
  | 'SendPulse'
  | 'SES'
  | 'SES-AP-NORTHEAST-1'
  | 'SES-AP-NORTHEAST-2'
  | 'SES-AP-NORTHEAST-3'
  | 'SES-AP-SOUTH-1'
  | 'SES-AP-SOUTHEAST-1'
  | 'SES-AP-SOUTHEAST-2'
  | 'SES-CA-CENTRAL-1'
  | 'SES-EU-CENTRAL-1'
  | 'SES-EU-NORTH-1'
  | 'SES-EU-WEST-1'
  | 'SES-EU-WEST-2'
  | 'SES-EU-WEST-3'
  | 'SES-SA-EAST-1'
  | 'SES-US-EAST-1'
  | 'SES-US-EAST-2'
  | 'SES-US-GOV-EAST-1'
  | 'SES-US-GOV-WEST-1'
  | 'SES-US-WEST-1'
  | 'SES-US-WEST-2'
  | 'Seznam'
  | 'SMTP2GO'
  | 'Sparkpost'
  | 'Tipimail'
  | 'Tutanota'
  | 'Yahoo'
  | 'Yandex'
  | 'Zimbra'
  | 'Zoho';

export interface IMailClientRecord {
  system: never;
}

export interface IMailTransport extends Omit<SMTPTransport.Options, 'service'> {
  service?: TypeMailTransportService;
}
export interface IMailOptions extends SMTPTransport.MailOptions, Partial<SMTPTransport.Options> {}

export interface ConfigMailClient {
  transport: IMailTransport;
  defaults?: IMailOptions;
}

export interface ConfigMail {
  defaultClient: keyof IMailClientRecord;
  clients: Record<keyof IMailClientRecord, ConfigMailClient>;
}

declare module 'vona' {
  export interface VonaConfigEnv {
    // default
    MAIL_DEFAULT_CLIENT: string | undefined;
    // system
    MAIL_SYSTEM_TRANSPORT_SERVICE: string | undefined;
    MAIL_SYSTEM_TRANSPORT_HOST: string | undefined;
    MAIL_SYSTEM_TRANSPORT_PORT: string | undefined;
    MAIL_SYSTEM_TRANSPORT_SECURE: string | undefined;
    MAIL_SYSTEM_TRANSPORT_AUTH_USER: string | undefined;
    MAIL_SYSTEM_TRANSPORT_AUTH_PASS: string | undefined;
    MAIL_SYSTEM_DEFAULTS_FROM: string | undefined;
  }
}
