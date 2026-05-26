export interface IErrorRenderOptions {
  returnHtml?: boolean;
}

declare module 'vona' {
  export interface VonaApplication {
    handleError: (err: Error) => Promise<void>;
  }
}
