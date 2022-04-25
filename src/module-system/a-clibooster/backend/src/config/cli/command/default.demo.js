module.exports = app => {
  return {
    bean: 'default.demo',
    resource: {
      atomStaticKey: 'cliDefaultDemo',
    },
    info: {
      version: '4.0.0',
      title: 'Cli Demo',
    },
    options: {
      username: {
        description: 'Your username',
        alias: 'u',
        type: 'string',
      },
      role: {
        description: 'Your role',
        alias: 'r',
        type: 'string',
      },
      course: {
        description: 'Your course',
        alias: 'c',
        type: 'string',
      },
      grade: {
        description: 'Your grade',
        alias: 'g',
        type: 'string',
      },
    },
    groups: {
      default: {
        description: 'Your basic info',
        condition: {
          expression: null,
        },
        questions: {
          username: {
            type: 'input',
            message: 'Your username',
          },
          role: {
            type: 'select',
            message: 'Your role',
            choices: ['teacher', 'student'],
          },
        },
      },
      teacher: {
        description: 'The teacher info',
        condition: {
          expression: 'context.argv.role==="teacher"',
        },
        questions: {
          course: {
            type: 'input',
            message: 'Your course',
          },
        },
      },
      student: {
        description: 'The student info',
        condition: {
          expression: 'context.argv.role==="student"',
        },
        questions: {
          grade: {
            type: 'input',
            message: 'Your grade',
          },
        },
      },
    },
  };
};
