export default {
  bean: 'bin.tsc',
  info: {
    version: '5.0.0',
    title: 'Cli: Bin: Tsc',
    usage: 'npm run vona :bin:tsc -- [--force] [--compiler=typescript|native] [--builders=]',
  },
  options: {
    compiler: {
      description:
        'TypeScript compiler (native requires @typescript/native in the project or repository root)',
      type: 'string',
      choices: ['typescript', 'native'],
    },
    builders: {
      description: 'Maximum number of projects to build concurrently (native only)',
      type: 'number',
    },
    force: {
      description: 'force',
      type: 'boolean',
    },
  },
};
