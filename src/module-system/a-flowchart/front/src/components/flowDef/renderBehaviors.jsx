export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ebOptions() {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // diagram
      const diagram = container.diagram;
      // nodeId
      const nodeId = container.id;
      // filter
      const nodes = diagram.contentProcess.nodes
        .filter(item => {
          return item.id !== nodeId && (item.type === 'startEventAtom' || item.type === 'activityUserTask');
        })
        .map(item => {
          return {
            title: item.nameLocale || item.name,
            value: item.id,
          };
        });
      // default
      nodes.unshift({ title: 'Default', value: '' });
      // ok
      return nodes;
    },
  },
  created() {},
  methods: {
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: true,
            onFetchChildren: ({ roleId }) => {
              return this.$api.post('/a/flowchart/flowDef/roleChildren', {
                host: this.host,
                params: {
                  roleId,
                  page: { size: 0 },
                },
              });
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              if (data) {
                const roles = data.map(item => item.data);
                for (const role of roles) {
                  const _role = this.assignees.roles.find(item => item.id === role.id);
                  if (!_role) {
                    // eslint-disable-next-line
                    this.assignees.roles.push(role);
                  }
                }
              }
            }
          },
        },
      });
    },
    _renderTitle() {
      const { validate } = this.context;
      const { readOnly } = validate;
      let domAdd;
      if (!readOnly) {
        domAdd = <eb-link iconMaterial="add" propsOnPerform={this.onPerformAdd}></eb-link>;
      }
      return (
        <f7-list-item group-title>
          <div class="display-flex justify-content-space-between">
            <div>{this.$text('Behaviors')}</div>
            {domAdd}
          </div>
        </f7-list-item>
      );
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.ebOptions,
    });
    return <div>{this._renderTitle()}</div>;
  },
};
