export default {
  bean: 'bin.dbReset',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: DbReset',
    usage: 'vona :bin:dbReset [--flavor=]',
  },
  options: {
    flavor: {
      description: 'flavor',
      type: 'string',
    },
  },
};
