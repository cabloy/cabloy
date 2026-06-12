export default {
  bean: 'bin.buildGeneral',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Build General',
    usage: 'npm run vona :bin:buildGeneral -- [--minify] [--sourcemap]',
  },
  options: {
    minify: {
      description: 'minify',
      type: 'boolean',
    },
    sourcemap: {
      description: 'sourcemap',
      type: 'boolean',
    },
  },
};
