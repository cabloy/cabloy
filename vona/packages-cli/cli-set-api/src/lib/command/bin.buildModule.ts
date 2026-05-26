export default {
  bean: 'bin.buildModule',
  info: {
    version: '5.0.0',
    title: 'Cli: Tools: Bin',
    usage: 'vona :bin:buildModule [--minify] [--sourcemap]',
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
