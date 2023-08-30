export default {
  data() {
    return {
      modals: [],
    };
  },
  methods: {
    deleteModal({ modal }) {
      const index = this.modals.findIndex(item => item.componentInstance === modal);
      if (index === -1) return;
      const modalInfo = this.modals[index];
      modalInfo.componentInstance = null;
      this.modals.splice(index, 1);
    },
    createModal({ module, name, options }) {
      return new Promise(resolve => {
        const id = this.$meta.util.nextId('viewModal');
        const modalInfo = {
          id,
          module,
          name,
          options,
          onComponentReady: componentInstance => {
            this.onComponentReady(componentInstance);
            resolve(modalInfo, componentInstance);
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
      return this.modals.map(modal => {
        return _h('eb-component', {
          key: modal.id,
          ref: modal.id,
          props: {
            module: modal.module,
            name: modal.name,
            options: modal.options,
          },
          on: {
            componentReady: componentInstance => {
              modal.onComponentReady(componentInstance);
            },
          },
        });
      });
    },
  },
};
