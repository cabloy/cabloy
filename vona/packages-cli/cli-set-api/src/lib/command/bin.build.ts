export default {
  bean: 'bin.build',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Build',
    usage: 'npm run vona :bin:build -- [--workers=] [--flavor=]',
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
