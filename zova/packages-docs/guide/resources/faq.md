# FAQ

## Why do the bean instance variable names use $$ as the prefix {#faq-$$}

It is recommended that the variable names of bean instances injected through the `@Use` decorator use the prefix `$$`. In this way, the variable names of the bean instance members will be divided into three groups, so that the required members can be found very quickly through auto-completion when writing code. Variable names are grouped as follows:

| Prefix | Examples                  | Description                                                                                    |
| ------ | ------------------------- | ---------------------------------------------------------------------------------------------- |
| $$     | this.$$counter            | Bean instances injected via @Use decorator                                                     |
| $      | this.$fetch, this.$router | Members inherited through the base class `BeanBase`, provide commonly used system capabilities |
| none   | this.count                | Members of the current bean instance                                                           |
