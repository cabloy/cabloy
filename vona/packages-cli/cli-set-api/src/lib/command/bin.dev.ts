export default {
  bean: 'bin.dev',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Dev',
    usage: 'npm run vona :bin:dev -- [--workers=] [--flavor=] [--mode=dev|test]',
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
    mode: {
      description: 'dev or test',
      type: 'string',
      choices: ['dev', 'test'],
    },
  },
};
