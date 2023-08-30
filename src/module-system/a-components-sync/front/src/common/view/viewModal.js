export default {
  data() {
    return {
      modals: [],
    };
  },
  beforeDestroy() {
    for (const modalInfo of this.modals) {
      modalInfo.componentInstance = null;
    }
    this.modals = [];
  },
  methods: {
    deleteModal({ modal }) {
      const index = this.modals.findIndex(item => item.componentInstance === modal);
      if (index === -1) return;
      const modalInfo = this.modals[index];
      modalInfo.componentInstance = null;
      this.modals.splice(index, 1);
    },
    createModal({ module, name, component, options }) {
      return new Promise(resolve => {
        const id = this.$meta.util.nextId('viewModal');
        const modalInfo = {
          id,
          module,
          name,
          component,
          options,
          onComponentReady: componentInstance => {
            this.onComponentReady(modalInfo, componentInstance);
            resolve(componentInstance);
          },
        };
        this.modals.push(modalInfo);
      });
    },
    onComponentReady(modalInfo, componentInstance) {
      modalInfo.componentInstance = componentInstance;
      const destroyOnClose = modalInfo.options?.destroyOnClose;
      if (destroyOnClose !== false) {
        const f7Modal = componentInstance.$el.f7Modal;
        f7Modal.once('modalClosed', () => {
          this.$nextTick(() => {
            this.deleteModal({ modal: componentInstance });
          });
        });
      }
    },
    _renderModals(_h) {
      return this.modals.map(modalInfo => {
        if (modalInfo.component) {
          return this._renderModalByComponent(_h, modalInfo);
        }
        return this._renderModalByName(_h, modalInfo);
      });
    },
    _renderModalByName(_h, modalInfo) {
      return _h('eb-component', {
        key: modalInfo.id,
        // ref: modalInfo.id,
        props: {
          module: modalInfo.module,
          name: modalInfo.name,
          options: modalInfo.options,
        },
        on: {
          componentReady: componentInstance => {
            modalInfo.onComponentReady(componentInstance);
          },
        },
      });
    },
    _renderModalByComponent(_h, modalInfo) {
      const options = Object.assign({}, modalInfo.options, {
        key: modalInfo.id,
        // ref: modalInfo.id,
        on: {
          componentMounted: componentInstance => {
            modalInfo.onComponentReady(componentInstance);
          },
        },
      });
      return _h(modalInfo.component, options);
    },
  },
};
