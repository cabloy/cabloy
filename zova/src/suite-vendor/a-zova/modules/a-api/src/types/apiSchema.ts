import 'zova';

export interface IApiSchemaOptions {
  authToken?: boolean;
}

declare module 'zova' {
  export interface IBeanSceneRecord {
    apiSchema: never;
  }
}
