declare module 'vona' {
  export interface ILoggerClientRecord {
    access: never;
  }

  export interface ILoggerChildRecord {
    req: never;
    res: never;
  }
}
