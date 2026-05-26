# Suite

## Origin of Suite

As the project continues to evolve iteratively, the business modules created will also expand. In addition, for some business scenarios, multiple modules are often required to be implemented together. To solve the above problems, Vona introduces the concept of suite. In short, a suite is a combination of a group of business modules, often corresponding to a specific business scenario, such as `e-commerce`, `CRM`, `supply chain`, and so on.

## Naming Convention

The suite uses a naming convention similar to the module:

```bash
FullName: vona-suite-{providerId}-{suiteName}
ShortName: {providerId}-{suiteName}
```

| Name       | Description |
| ---------- | ----------- |
| providerId | Provider ID |
| suiteName  | Suite Name  |

## Directory Structure

A suite is a combination of a group of business modules, so the directory structure is also very simple. Take the suite `a-home` as an example:

```bash
a-home
├── modules
│   ├── home-base
│   ├── home-index
│   ├── home-user
│   └── ...
└── package.json
```

## Create Suite

### 1. Cli command

```bash
$ vona :create:suite suiteName
```

| Name      | Description |
| --------- | ----------- |
| suiteName | Suite Name  |

### 2. Menu command

::: tip
Context Menu - [Project Path/src/suite]: `Vona Create/Suite`
:::

Enter the suite name according to the prompt, such as `demo-student`, and the VSCode extension will automatically create the code skeleton of the suite.
