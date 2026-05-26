# Create the first CRUD

Next, let's create our first CRUD to manage `Student` data.

## Creating a New Module

First, create a module named `demo-student`. There are two ways to create a module:

### 1. Cli Command

```bash
$ vona :create:module demo-student --suite=
```

### 2. Menu Command

::: tip
Context menu - [Project Path/src/module]: `Vona Create/Module`
:::

Follow the prompts and enter the module name `demo-student`. The VSCode plugin will automatically create the module code skeleton.

::: warning
Please make sure you have installed the VSCode extension: [Vona - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.vona-vscode)
:::

## Create CRUD

Next, we'll use Vona's built-in code generator to create the CRUD code skeleton. There are also two methods:

### 1. Cli Command

```bash
$ vona :tools:crud student --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Vona Tools/Generate Crud`
:::

Enter the resource name `student` as prompted. The VSCode extension will automatically create the CRUD code skeleton.

## CRUD Admin Page

Restart Dev Server, then open http://localhost:7102 to directly perform CRUD operations for Student.

```bash
$ npm run dev
```

## Swagger/Rapidoc

We can use [Swagger](https://swagger.io)/[Rapidoc](https://rapidocweb.com) to view and try the Student CRUD API.

After starting the development server, the system automatically outputs the Swagger/Rapidoc URL to the terminal:

```bash
[a-swagger] swagger: http://localhost:7102/swagger
[a-swagger] rapidoc: http://localhost:7102/rapidoc
```
