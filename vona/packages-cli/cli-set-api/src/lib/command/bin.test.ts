export default {
  bean: 'bin.test',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Test',
    usage: 'vona :bin:test [--coverage=] [--flavor=]',
  },
  options: {
    coverage: {
      description: 'coverage',
      type: 'boolean',
    },
    flavor: {
      description: 'flavor',
      type: 'string',
    },
  },
};
