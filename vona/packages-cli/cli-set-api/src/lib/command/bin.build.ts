export default {
  bean: 'bin.build',
  info: {
    version: '5.0.0',
    title: 'Cli: Tools: Bin',
    usage: 'vona :bin:build [--workers=] [--flavor=] [--sourcemap=]',
  },
  options: {
    workers: {
      description: 'workers',
      type: 'number',
    },
    flavor: {
      description: 'flavor',
      type: 'string',
    },
  },
};
