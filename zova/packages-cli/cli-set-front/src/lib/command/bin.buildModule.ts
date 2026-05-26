export default {
  bean: 'bin.buildModule',
  info: {
    version: '5.0.0',
    title: 'Cli: Tools: Bin',
    usage: 'zova :bin:buildModule [--minify] [--sourcemap] [--dts]',
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
    dts: {
      description: 'dts',
      type: 'boolean',
    },
  },
};
