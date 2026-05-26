import 'zova-module-a-style';

export interface ThemeTokenCustom {
  color: {
    primary: string;
  };
  var: {
    borderColor: string;
  };
  component: {
    page: {
      background: string;
      color: string;
    };
  };
}

declare module 'zova-module-a-style' {
  export interface ThemeToken extends ThemeTokenCustom {}
}
