export default {
  validate: {
    hint: {
      optional: '?',
      must: '',
    },
  },
  form: {
    floatingLabel: false,
  },
  error: {
    message: {
      maxLength: {
        default: 80,
        'en-us': 80,
        'zh-cn': 40,
      },
    },
  },
};
