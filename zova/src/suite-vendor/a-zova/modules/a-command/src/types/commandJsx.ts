export interface IJsxCommandOptionsBase {}

export interface IJsxCommandOptionsRes extends IJsxCommandOptionsBase {
  res?: string;
}

export interface IJsxCommandOptionsEvent extends IJsxCommandOptionsRes {
  stop?: boolean;
  prevent?: boolean;
  children?: any;
}

export interface IJsxCommandOptionsCommands extends IJsxCommandOptionsRes {
  children?: any;
}
