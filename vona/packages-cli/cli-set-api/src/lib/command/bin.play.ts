export default {
  bean: 'bin.play',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Play',
    usage: 'vona :bin:play [index.ts] [--flavor=] [--retainRuntime=] [--attach]',
  },
  options: {
    mode: {
      description: 'mode',
      type: 'string',
    },
    flavor: {
      description: 'flavor',
      type: 'string',
    },
    retainRuntime: {
      description: 'retainRuntime',
      type: 'boolean',
    },
    attach: {
      alias: 'a',
      description: 'attach',
      type: 'boolean',
    },
  },
};
