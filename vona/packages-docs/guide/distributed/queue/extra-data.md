# Extra Data

When using the `push/pushAsync` method to push jobs, you can pass extra data.

## Example

```diff
class ControllerStudent {
  async test() {
    const data = { a: 1, b: 2 };
    this.scope.queue.add.push(data, {
+     extraData: {
+       request: {
+         headers: {
+           'x-custom': 'xxxx',
+         },
+       },
+     },
    });
  }
}
```

- `extraData.request.headers`: Pass in the header values

When executing the job, you can directly obtain the `header` value:

```diff
@Queue()
class QueueAdd {
  async execute(data, _options) {
+   console.log(this.ctx.headers['x-custom']);
  }
}
```

## Headers Passthrough

VonaJS provides a convention: for headers prefixed with `x-vona-data-`, they are automatically appended to `extra data`, thus passing them through to the job.
