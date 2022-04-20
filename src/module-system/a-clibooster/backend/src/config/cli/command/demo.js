module.exports = app => {
  return {
    info: {
      version: '4.0.0',
      title: 'Cli Demo',
      usage: 'Usage: npm run :demo [options]',
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
        description: 'Specify your basic info',
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
        description: 'Specify the teacher info',
        condition: {
          expression: 'role==="teacher"',
        },
        questions: {
          course: {
            type: 'input',
            message: 'Your course',
          },
        },
      },
      student: {
        description: 'Specify the student info',
        condition: {
          expression: 'role==="student"',
        },
        questions: {
          grade: {
            type: 'input',
            message: 'Your grade',
          },
        },
      },
    },
    bean: 'demo',
  };
};
