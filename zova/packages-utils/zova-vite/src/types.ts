export interface ZovaViteConfigChunkVendor {
  match: (string | RegExp)[];
  output: string;
}

export interface ZovaViteConfigOptions {
  appDir: string;
  /** Generated runtime directory, relative to appDir. Defaults to `.zova`. */
  runtimeDir?: string;
  zovaManualChunk?: {
    debug: boolean;
    vendors: ZovaViteConfigChunkVendor[];
  };
}

export interface ZovaViteContext {
  appDir: string;
  runtimeDir: string;
  runtimePath: string;
  isolated: boolean;
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
