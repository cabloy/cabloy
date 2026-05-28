import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: false,
  rollup: {
    emitCJS: false,
  },
});
