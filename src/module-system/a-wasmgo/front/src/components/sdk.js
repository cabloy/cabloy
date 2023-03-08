import './wasm_exec.js';

let __goInstance = null;

export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'go') return this._go();
      if (action.name === 'loadWasm') return await this._loadWasm({ item });
      if (action.name === 'run') return await this._run({ item });
    },
    _go() {
      if (!__goInstance) {
        const Go = window.Go;
        __goInstance = new Go();
      }
      return __goInstance;
    },
    async _loadWasm({ item }) {
      // polyfill
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          const source = await (await resp).arrayBuffer();
          return await WebAssembly.instantiate(source, importObject);
        };
      }
      // force __goInstance
      const go = this._go();
      // load wasm
      return await WebAssembly.instantiateStreaming(fetch(item.source), go.importObject);
    },
    async _run({ item }) {},
  },
};
