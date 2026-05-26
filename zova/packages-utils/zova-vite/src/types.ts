export interface ZovaViteConfigChunkVendor {
  match: (string | RegExp)[];
  output: string;
}

export interface ZovaViteConfigOptions {
  appDir: string;
  runtimeDir: string;
  zovaManualChunk?: {
    debug: boolean;
    vendors: ZovaViteConfigChunkVendor[];
  };
}

export interface ZovaViteConfigResult {
  env: { [name: string]: string };
  vitePlugins: any[];
  viteConfig: any;
}

export type ZovaVitePlugin = [
  string,
  (...args: any[]) => any,
  any,
  { client?: boolean; server?: boolean } | undefined,
];
