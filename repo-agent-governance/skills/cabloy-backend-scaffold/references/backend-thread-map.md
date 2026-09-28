# Backend Thread Map

Use this reference when a backend request needs to be turned into the right Vona thread.

## Common request -> likely thread

### “Add a controller action”

Usually means:

- controller update
- service update
- DTO and validation check
- OpenAPI contract check
- test update

### “Add a new backend resource”

Usually means:

- controller
- service
- model
- entity
- dto
- migration/version
- test

Consider whether `npm run vona :tools:crud ...` is a better fit than piecemeal creation.

### “Add a model or entity change”

Usually means:

- model/entity update
- migration/version update
- possibly field indexes
- possibly DTO/OpenAPI changes
- possibly cache or relation review

### “Just add a DTO”

Usually means:

- DTO creation or inference decision
- validation rule alignment
- OpenAPI contract alignment
- controller/service usage updates

## Generation-first rule

If a Vona generator exists for the thread, use it first and refine second.
