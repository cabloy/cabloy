export default {
  bean: 'bin.buildModule',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Build Module',
    usage: 'npm run vona :bin:buildModule -- [--minify] [--sourcemap]',
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
