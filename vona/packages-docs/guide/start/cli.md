# Cli Commands

Vona provides a large number of Cli commands for generating code skeletons for various resources.

## Example

Create a Service: `student` in the module demo-student, the command is as follows:

```bash
$ vona :create:bean service student --module=demo-student
```

## Command usage

Vona's Cli commands have a unified format. As long as we master the ideas of running the following commands, we can easily use all commands.

1. List all commands

```bash
$ vona :
```

2. List commands for a specified group

```bash
$ vona :create
```

3. View the help information of a specified command

```bash
$ vona :create:bean --help
```
