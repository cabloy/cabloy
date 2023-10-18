// export
export default {
  meta: {
    uses: 'a-basefront',
  },
  installFactory,
};

// installFactory
function installFactory() {
  return {
    props: {
      context: {
        type: Object,
      },
    },
    data() {
      const { parcel, property, validate } = this.context;
      const options = {
        atomIdMain: parcel.data.atomId,
        atomMain: parcel.data,
      };
      if (validate.host?.flowTaskId) {
        options.flowTaskId = validate.host?.flowTaskId;
      }
      const params = {
        pageTitle: this.context.getTitle(true),
      };
      return {
        container: {
          atomClass: property.ebParams.atomClass,
          options,
          params,
          scene: null,
          layout: null,
          mode: validate.host && validate.host.mode,
          layoutKeyBase: 'a-detail:layoutDetailListBase',
        },
      };
    },
    created() {},
    methods: {
      layout_renderTitle() {
        return (
          <f7-list-item groupTitle>
            <div class="detail-list-title-container">
              {this.layout_renderTitleLeft()}
              {this.layout_renderTitleRight()}
            </div>
          </f7-list-item>
        );
      },
      layout_renderTitleLeft() {
        const title = this.container.params?.pageTitle;
        return <div class="actions-block actions-block-left">{title}</div>;
      },
      layout_renderTitleRight() {
        const children = this.bulk_renderActionsRight();
        return <div class="actions-block actions-block-right">{children}</div>;
      },
      bulk_renderActionsRight() {
        const children = [];
        const { property } = this.context;
        if (!property.ebReadOnly) {
          children.push(
            <eb-link
              key={'actionsRight:create'}
              iconF7="::add"
              tooltip={this.$text('Create')}
              propsOnPerform={event => this.bulk_onActionCreate(event)}
            ></eb-link>
          );
        }
        return children;
      },
      async bulk_onActionCreate_saveAtomMain() {
        const { validate } = this.context;
        return await validate.perform(null, { action: 'save' });
      },
      async bulk_onActionCreate_createDetail({ event, atomMain }) {
        // action
        const useStoreAtomActions = await this.$store.use('a/basestore/atomActions');
        let actionCreate = await useStoreAtomActions.getActionBase({
          atomClass: this.container.atomClass,
          name: 'create',
        });
        // dataOptions
        const dataOptions = {
          atomIdMain: atomMain.atomId,
          atomMain,
        };
        if (this.container.options.flowTaskId) {
          dataOptions.flowTaskId = this.container.options.flowTaskId;
        }
        // not use this.$utils.extend
        actionCreate = Object.assign({}, actionCreate, { targetEl: event.currentTarget }, { dataOptions });
        // item
        const item = {
          module: this.container.atomClass.module,
          atomClassName: this.container.atomClass.atomClassName,
        };
        // performAction
        return await this.$meta.util.performAction({ ctx: this, action: actionCreate, item });
      },
      async bulk_onActionCreate(event) {
        // 1. save
        const atomMain = await this.bulk_onActionCreate_saveAtomMain();
        // 2. create detail
        await this.bulk_onActionCreate_createDetail({ event, atomMain });
      },
    },
    render() {
      return this.layout_renderTitle();
    },
  };
}
