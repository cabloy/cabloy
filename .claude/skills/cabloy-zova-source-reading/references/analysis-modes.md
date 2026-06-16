# Analysis Modes

Use this reference to choose the shortest correct analysis posture before reading Zova source deeply.

## Mode A: source-location mode

Use this mode when the user is mainly asking:

- where should I start reading?
- which files matter?
- what order should I read the source in?
- where is this implemented?

### Workflow

1. detect the active edition if UI-sensitive assumptions might matter
2. start from the public frontend docs first
3. pick the smallest matching thread from `cabloy-docs/frontend/zova-source-reading-map.md`
4. cite the initial source files in the recommended reading order
5. stop before tracing deeper runtime layers unless the user also wants runtime-flow analysis

### Output emphasis

- reading order
- key file paths
- why those files are the right starting points

## Mode B: runtime-flow mode

Use this mode when the user is mainly asking:

- how does this work internally?
- why is this reactive?
- where does this controller/page/component behavior come from?
- how does render, route state, or lifecycle enter the runtime?

### Workflow

1. read the public Zova-native explanation docs first:
   - `reading-zova-for-vue-developers.md`
   - `zova-reactivity-under-the-hood.md`
2. identify the concrete thread:
   - page controller
   - component controller
   - route/state
   - model
   - behavior
   - SSR
3. trace the smallest current-source path that confirms the runtime behavior
4. distinguish source-confirmed behavior from interpretation
5. only after the Zova-native explanation is clear, add Vue analogy if helpful

### Output emphasis

- entrypoint
- intermediate runtime files
- what triggers the behavior
- what is source-confirmed

## Mode C: Vue-vs-Zova comparison mode

Use this mode when the user is mainly asking:

- how should I understand this relative to Vue 3?
- is this just Vue with a different syntax?
- what is the Zova way here?

### Workflow

1. explain the Zova-native architectural role first
2. identify which public Zova doc best defines that role
3. if needed, trace one representative source path to confirm the runtime grounding
4. only then provide Vue analogies as approximate translations
5. explicitly avoid flattening Zova back into generic Vue habits

### Output emphasis

- Zova-native role
- closest Vue analogy
- what is genuinely shared underneath
- what changes at the authoring-model level

## Combined requests

If a request spans multiple modes, answer in this order:

1. source-location mode
2. runtime-flow mode
3. Vue-vs-Zova comparison mode

This keeps the explanation anchored in the real source path before analogy work begins.
