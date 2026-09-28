# Frontend Thread Map

Use this reference when a frontend request needs to be turned into the right Zova thread.

## Common request -> likely thread

### “Add a new page”

Usually means:

- page generation
- route review
- params/query additions if needed
- API/model integration
- metadata refresh if routing changes affect typed artifacts

### “Add a new component”

Usually means:

- component generation
- props/v-model/generic follow-up if needed
- wrapper-based usage review
- style/theme/icon review if UI behavior changes

### “Add data access to a page”

Usually means:

- API service or model bean
- possible OpenAPI SDK usage
- possible SSR init-data follow-up
- metadata or route refresh if the page shape changes too

### “Change route/query/params behavior”

Usually means:

- page route review
- `refactor:*` path first
- metadata regeneration
- route alias / guard / SSR review

### “Change UI contract of a component”

Usually means:

- component props
- `v-model`
- generic component or wrapper behavior

## Generation-first rule

If a Zova generator or refactor command exists for the frontend thread, use it first and refine second.
