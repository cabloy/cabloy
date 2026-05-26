# Logger Level

You can control the messages written to log files based on levels.

## NPM Levels

VonaJS uses NPM levels, see: [RFC5424](https://tools.ietf.org/html/rfc5424)

```typescript
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};
```

## Log Methods

A set of log methods corresponds to the levels.

```typescript
this.$logger.error('test');
this.$logger.warn('test');
this.$logger.info('test');
this.$logger.http('test');
this.$logger.verbose('test');
this.$logger.debug('test');
this.$logger.silly('test');
```

## Default Logger Level

VonaJS's default logger level is `info`, allowing you to control that only messages with level `<=info` are written to the file.

### 1. makeTransportFile

When creating a new `order` Client, you can implement this strategy using the `makeTransportFile` method: only messages with level `<=info` are written to the file.

```diff
// logger
config.logger = {
  clients: {
    order(this: VonaApplication, clientInfo) {
      const transports = [
+       this.bean.logger.makeTransportFile(clientInfo, 'order'),
        this.bean.logger.makeTransportConsole(clientInfo),
      ];
      return { transports };
    },
  },
};
```

### 2. makeTransportFile: Independent File

If you need to force a certain level of messages to be written to an independent file, you can add another file transport. For example, writing `debug` level messages to the file `order-debug`

```diff
// logger
config.logger = {
  clients: {
    order(this: VonaApplication, clientInfo) {
      const transports = [
+       this.bean.logger.makeTransportFile(clientInfo, 'order-debug', 'debug'),
        this.bean.logger.makeTransportFile(clientInfo, 'order'),
        this.bean.logger.makeTransportConsole(clientInfo),
      ];
      return { transports };
    },
  },
};
```

### 3. makeTransportConsole

For the console transport, there is a special convention: all `silly` level messages will be output to the console. Therefore, this strategy is implemented through the `makeTransportConsole` method.

```diff
// logger
config.logger = {
  clients: {
    order(this: VonaApplication, clientInfo) {
      const transports = [
        this.bean.logger.makeTransportFile(clientInfo, 'order'),
+       this.bean.logger.makeTransportConsole(clientInfo),
      ];
      return { transports };
    },
  },
};
```

## Default Level Configuration

The default level configuration can be modified through the .env file.

Since multiple Clients can be configured, each Client can configure its own default level.

### 1. Client: `default`

```typescript
LOGGER_CLIENT_DEFAULT =
```

The following values ​​are supported: `(empty)/true/false/{level}`

For example, to write messages of level `<=debug` to a file, configure as follows:

```typescript
LOGGER_CLIENT_DEFAULT = debug;
```

You can also set the environment variable directly in the console:

```bash
LOGGER_CLIENT_DEFAULT=debug npm run dev
```

### 2. Client: `order`

For the newly added Client `order`, a default level can also be set:

```typescript
LOGGER_CLIENT_ORDER = verbose;
```

## Get the current level

The current level can be obtained during system running:

```typescript
class ControllerStudent {
  async test() {
    // logger: default
    const levelDefault = this.bean.logger.getFilterLevel();
    // logger: order
    const levelOrder = this.bean.logger.getFilterLevel('order');
  }
}
```

## Dynamically Modifying the Level

The level can be dynamically modified during system running, allowing control over the level-based write strategy at any time without downtime or restart.

When the `setLevel` method is called, the system automatically broadcasts it to all Workers, thereby modifying the current level in each worker process.

```typescript
class ControllerStudent {
  async test() {
    // level: info
    let levelDefault = this.bean.logger.getFilterLevel();
    assert.equal(levelDefault, 'info');
    this.$logger.debug('1: this line will not output');
    // level: debug
    this.bean.logger.setFilterLevel('debug');
    levelDefault = this.bean.logger.getFilterLevel();
    assert.equal(levelDefault, 'debug');
    this.$logger.debug('2: this line will output');
    // disable
    this.bean.logger.setFilterLevel(false);
    levelDefault = this.bean.logger.getFilterLevel();
    assert.equal(levelDefault, false);
    this.$logger.info('3: this line will not output');
    this.$logger.debug('4: this line will not output');
    // enable
    this.bean.logger.setFilterLevel(true);
  }
}
```
