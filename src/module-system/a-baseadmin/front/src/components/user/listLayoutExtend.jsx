export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onTableColumns({ columns }) {
      return columns;
    },
    onFilterSchema({ schema, type }) {
      const properties = schema.schema.properties;
      if (type === 'basic') {
        // Title -> Username
        properties.atomName.ebTitle = 'Username';
      } else if (type === 'general') {
        // hide mine
        properties.mine.ebType = null;
        // Created Date -> Join Date
        properties.createdAt.ebTitle = 'Join Date';
      }
      return schema;
    },
  },
};
