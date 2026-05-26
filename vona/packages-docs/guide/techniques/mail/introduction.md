# Mail

VonaJS implements email sending capabilities based on [Nodemailer](https://github.com/nodemailer/nodemailer)

## Features

1. Sends emails based on a queue
2. Provides a `test` service, facilitating testing of email sending capabilities during development without requiring a real mail server

## App Config

Email configuration can be done in App Config:

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-mail': {
    defaultClient: 'system',
    clients: {
      system: {
        transport: {
          service: 'test',
          host: 'xx.xx.xx.xx',
          port: 587,
          secure: false,
          auth: {
            user: 'xxx',
            pass: 'xxx',
          },
        },
        defaults: {
          from: 'no.reply@cabloy.com',
        },
      },
    },
  },
};
```

| Name          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| defaultClient | Default Client name, defaults to `system`                                  |
| clients       | Configure multiple Clients. The system provides a built-in `system` Client |

- Client

| Name      | Description                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| transport | Mail service configuration                                                                                                                      |
| defaults  | Default values ​​for email. For example, when sending emails, if the value of the `from` field is not specified, then the default value is used |

- Transport

| Name      | Description                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------ |
| service   | Built-in service name, such as `Gmail`. If service is specified, `host/port` no longer needs to be set |
| host      | Host                                                                                                   |
| port      | Port                                                                                                   |
| secure    | Whether service security is enabled                                                                    |
| auth.user | Account name                                                                                           |
| auth.pass | Account password                                                                                       |

- `service: test`: VonaJS provides a built-in `test` service. This allows for convenient testing of email sending capabilities during development without needing to provide a real mail server

## env

Email configuration can also be done in the env file:

`env/.env`

```typescript
# mail

MAIL_DEFAULT_CLIENT = 'system'

MAIL_SYSTEM_TRANSPORT_SERVICE =
MAIL_SYSTEM_TRANSPORT_HOST =
MAIL_SYSTEM_TRANSPORT_PORT =
MAIL_SYSTEM_TRANSPORT_SECURE = false
MAIL_SYSTEM_TRANSPORT_AUTH_USER =
MAIL_SYSTEM_TRANSPORT_AUTH_PASS =
MAIL_SYSTEM_DEFAULTS_FROM = no.reply@cabloy.com
```

## Adding a New Client

### 1. Adding Type Definition

Add a new client type definition using the interface merging mechanism, such as `order`, for sending order-related emails.

In VSCode In the editor, enter the code snippet `recordmailclient` to automatically generate the code skeleton:

```typescript
declare module 'vona-module-a-mail' {
  export interface IMailClientRecord {
    : never;
  }
}
```

Adjust the code, then add `order`

```diff
declare module 'vona-module-a-mail' {
  export interface IMailClientRecord {
+   order: never;
  }
}
```

### 2. Adding Client Configuration

`src/backend/config/config/config.ts`

```diff
// modules
config.modules = {
  'a-mail': {
    defaultClient: 'system',
    clients: {
      system: {
        ...
      },
+     order: {
+       ...
+     },
    },
  },
};
```

## bean.mail

VonaJS provides a global bean `bean.mail` through the module `a-mail`, which can be used to send emails.

```typescript
import type { IMailOptions } from 'vona-module-a-mail';

class ControllerStudent {
  @Web.get('test')
  async test() {
    const mail: IMailOptions = {
      to: 'someone@cabloy.com',
      subject: 'this is a test mail',
      text: 'message body!',
    };
    await this.bean.mail.send(mail);
  }
}
```

You can specify which client to use when sending emails.

```typescript
await this.bean.mail.send(mail, 'order');
```

## Queue Configuration

VonaJS uses a built-in queue to send emails. You can modify the queue configuration in App Config.

```typescript
// onions
config.onions = {
  queue: {
    'a-mail:mail': {
      options: {
        worker: {
          concurrency: 10,
        },
      },
    },
  },
};
```

| Name               | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| worker.concurrency | Number of tasks that each Worker can execute simultaneously |
