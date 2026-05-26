# Mail发送邮件

VonaJS 基于[Nodemailer](https://github.com/nodemailer/nodemailer)实现了发送邮件的能力。

## 特性

1. 基于队列发送邮件
2. 提供了`test`服务，方便在开发阶段测试邮件发送能力，而不需要提供真实的邮件服务器

## App Config

可以在 App Config 中进行邮件配置：

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

| 名称          | 说明                                             |
| ------------- | ------------------------------------------------ |
| defaultClient | 缺省Client名，默认为`system`                     |
| clients       | 配置多个Clients。系统提供了内置的`system` Client |

- Client

| 名称      | 说明                                                                         |
| --------- | ---------------------------------------------------------------------------- |
| transport | 邮件服务配置                                                                 |
| defaults  | 邮件的缺省值。比如，当发送邮件时，如果不指定`from`字段的值，那么就使用缺省值 |

- Transport

| 名称      | 说明                                                                  |
| --------- | --------------------------------------------------------------------- |
| service   | 内置服务名，比如`Gmail`。如果指定了service，则不再需要设置`host/port` |
| host      | Host                                                                  |
| port      | Port                                                                  |
| secure    | 是否启用服务安全                                                      |
| auth.user | 账户名称                                                              |
| auth.pass | 账户密码                                                              |

`service: test`: VonaJS 提供了内置的`test`服务。方便在开发阶段测试邮件发送能力，而不需要提供真实的邮件服务器。

## env配置

也可以在 env 文件中进行邮件配置：

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

## 添加新Client

### 1. 添加类型定义

采用接口合并机制添加新 Client 的类型定义，比如`order`，用于发送与订单相关的邮件。

在 VSCode 编辑器中，输入代码片段`recordmailclient`，自动生成代码骨架:

```typescript
declare module 'vona-module-a-mail' {
  export interface IMailClientRecord {
    : never;
  }
}
```

调整代码，然后添加`order`

```diff
declare module 'vona-module-a-mail' {
  export interface IMailClientRecord {
+   order: never;
  }
}
```

### 2. 增加Client配置

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

VonaJS 通过模块`a-mail`提供了全局 Bean `bean.mail`，可用于发送邮件。

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

可以在发送邮件时指定使用哪个 Client。

```typescript
await this.bean.mail.send(mail, 'order');
```

## 队列配置

VonaJS 采用一个内置队列发送邮件。可以在 App Config 中修改队列配置。

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

| 名称               | 说明                         |
| ------------------ | ---------------------------- |
| worker.concurrency | 每个Worker可同时执行的任务数 |
