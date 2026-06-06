# Mail Guide

## Why mail matters in Vona

Vona treats email delivery as a framework capability rather than a one-off SMTP utility call.

That matters because email sending often needs queue-backed execution, multiple clients, environment-specific configuration, and integration with user-access or other business workflows.

## Core mail model

The `a-mail` module provides email delivery on top of Nodemailer.

The most important framework-level pieces are:

- one or more **mail clients**
- a **default client**
- queue-backed sending
- configuration through app config or environment variables

## Mail clients

Mail clients are configured under the `a-mail` module config.

Representative configuration areas include:

- `defaultClient`
- `clients`

A client usually defines:

- `transport`
- `defaults`

### Transport

Transport settings describe how mail is actually delivered, for example:

- `service`
- `host`
- `port`
- `secure`
- `auth.user`
- `auth.pass`

### Defaults

Defaults provide common message values such as `from`.

## Built-in test service

Vona provides a built-in `test` mail service so email flows can be exercised during development without requiring a real mail server.

This is important because it makes email behavior easier to verify early instead of deferring all mail testing to production-like infrastructure.

## Configuration through app config and env

Mail configuration can be provided through:

- app config under `config.modules['a-mail']`
- environment variables such as `MAIL_DEFAULT_CLIENT` and related transport/default fields

That means operational mail behavior can remain configurable without rewriting application logic.

## Adding a new mail client

Projects can add additional clients for different email responsibilities, such as a dedicated `order` client.

This is useful when different workflows need different senders, transports, or message defaults.

## `bean.mail`

Vona exposes a global bean `bean.mail` for sending emails.

Representative pattern:

```typescript
const mail: IMailOptions = {
  to: 'someone@cabloy.com',
  subject: 'this is a test mail',
  text: 'message body!',
};
await this.bean.mail.send(mail);
```

A specific client can also be selected explicitly:

```typescript
await this.bean.mail.send(mail, 'order');
```

## Queue-backed delivery

Vona sends mail through a built-in queue.

This is one of the most important architectural points of the mail system, because email delivery is naturally asynchronous and should not be tightly coupled to the immediate request path.

Queue behavior can be tuned through queue config, for example worker concurrency.

## Relationship to user-access and event workflows

Mail is commonly part of broader backend lifecycle behavior such as:

- account registration follow-up
- activation or confirmation mail
- notification workflows after business events

Read this guide together with:

- [User Access Guide](/backend/user-access-guide)
- [Event Guide](/backend/event-guide)

Those guides explain the flows where mail often becomes a downstream effect rather than the initiating business action.

## When to use a dedicated mail client

Use a dedicated client when:

- a workflow needs a different sender identity
- a workflow needs a different transport
- a workflow needs separate operational handling from the default client

Use the default client when the mail path belongs to the general system mail flow.

## Why this matters for AI workflows

When AI edits backend mail behavior, it should ask:

1. should this email be sent through the default client or a dedicated client?
2. does the flow belong in the immediate request path or in a queue-backed asynchronous path?
3. is the existing `test` mail service enough for development verification?
4. does the mail behavior belong to a user-access lifecycle event or a broader business event workflow?

That helps AI keep email delivery aligned with Vona’s operational and event-driven backend model.
