import './wasm_exec.js';

export default {
  state() {
    return {
      goInstance: null,
    };
  },
  actions: {
    getInstance() {
      if (!this.goInstance) {
        const Go = window.Go;
        this.goInstance = new Go();
      }
      return this.goInstance;
    },
    async loadWasm({ source }) {
      // polyfill
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          const source = await (await resp).arrayBuffer();
          return await WebAssembly.instantiate(source, importObject);
        };
      }
      // force __goInstance
      const goInstance = this.getInstance();
      // load wasm
      return await WebAssembly.instantiateStreaming(fetch(source), goInstance.importObject);
    },
    async run({ source }) {
      // force __goInstance
      const goInstance = this.getInstance();
      // load wasm
      const wasmResult = await this.loadWasm({ source });
      // run wasm
      return await goInstance.run(wasmResult.instance);
    },
  },
};
