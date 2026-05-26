# 日志分级

可以基于分级控制写入日志文件的消息内容。

## NPM分级

VonaJS 采用 NPM 分级规则，参见: [RFC5424](https://tools.ietf.org/html/rfc5424)

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

## 输出方法

与分级对应的是一组输出方法。

```typescript
this.$logger.error('test');
this.$logger.warn('test');
this.$logger.info('test');
this.$logger.http('test');
this.$logger.verbose('test');
this.$logger.debug('test');
this.$logger.silly('test');
```

## 默认分级

VonaJS 的默认分级是`info`，从而可以控制只有`<=info`的分级日志才写入文件。

### 1. makeTransportFile

我们再新建`order` Client，可以通过`makeTransportFile`方法实现此策略: 只有`<=info`的分级日志才写入文件。

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

### 2. makeTransportFile: 独立文件

如果需要强制某个分级的日志写入独立的文件，可以再增加一个文件通道。比如，将`debug`分级的日志写入文件`order-debug`中。

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

对于控制台通道，有一个特殊约定：凡是`silly`分级的日志，都会输出到控制台。因此，通过`makeTransportConsole`方法实现此策略。

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

## 默认分级配置

可以通过.env 文件修改默认的分级配置。

由于可以配置多个 Clients，因此，Clients 可以单独配置自己的默认分级。

### 1. Client: `default`

```typescript
LOGGER_CLIENT_DEFAULT =
```

支持如下值：`(empty)/true/false/{level}`

比如，希望`<=debug`分级的日志写入文件，那么，配置如下:

```typescript
LOGGER_CLIENT_DEFAULT = debug;
```

也可以直接在控制台设置环境变量:

```bash
LOGGER_CLIENT_DEFAULT=debug npm run dev
```

### 2. Client: `order`

对于新增的 Client `order`，也可以设置默认分级：

```typescript
LOGGER_CLIENT_ORDER = verbose;
```

## 获取当前分级

在系统运行中可以获取当前分级：

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

## 动态修改分级

在系统运行中可以动态修改分级，从而在不停机、不重启的情况下，随时控制基于分级的写入策略。

当调用`setLevel`方法时，系统会自动广播至所有 Workers，从而修改每个工作进程中的当前分级。

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
