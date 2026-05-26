# Cli命令

Vona 提供了大量的 Cli 命令，用于生成各类资源的代码骨架。

## 举例

在模块 demo-student 中创建一个 Service：`student`，命令如下：

```bash
$ vona :create:bean service student --module=demo-student
```

## 命令的用法

Vona 的 Cli 命令有统一的格式，只要掌握了以下几个命令运行的思路，就可以轻松使用所有的命令。

1. 列出所有命令

```bash
$ vona :
```

2. 列出指定分组的命令

```bash
$ vona :create
```

3. 查看指定命令的 help 信息

```bash
$ vona :create:bean --help
```
