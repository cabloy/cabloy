import 'vue';
import 'vue/jsx-runtime';
import '@vue/runtime-dom';

declare module 'vue' {
  export interface ComponentCustomOptions {
    meta?: {
      global?: boolean;
    };
  }

  export interface AllowedComponentProps {}
}

export interface IComponentIntrinsicAttributes {
  class?: unknown;
  style?: unknown;
  // need not provide onClick/onXXX
  // onClick?: (e: MouseEvent) => void;
  nativeOnClick?: (e: MouseEvent) => void;
  nativeOnDblclick?: (e: MouseEvent) => void;
  nativeOnMouseenter?: (e: MouseEvent) => void;
  nativeOnMouseleave?: (e: MouseEvent) => void;
  nativeOnMouseover?: (e: MouseEvent) => void;
  nativeOnMouseout?: (e: MouseEvent) => void;
  nativeOnMousedown?: (e: MouseEvent) => void;
  nativeOnMouseup?: (e: MouseEvent) => void;
  nativeOnKeydown?: (e: KeyboardEvent) => void;
  nativeOnKeyup?: (e: KeyboardEvent) => void;
  nativeOnFocus?: (e: FocusEvent) => void;
  nativeOnBlur?: (e: FocusEvent) => void;
  nativeOnChange?: (e: Event) => void;
  nativeOnInput?: (e: Event) => void;
  nativeOnSubmit?: (e: Event) => void;
  nativeOnScroll?: (e: Event) => void;
  nativeOnWheel?: (e: WheelEvent) => void;
  nativeOnContextmenu?: (e: MouseEvent) => void;
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes extends IComponentIntrinsicAttributes {}
  }
}

declare module '@vue/runtime-dom' {
  export interface LabelHTMLAttributes {
    htmlFor?: string;
  }

  export interface SVGAttributes {
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeWidth?: string;
  }
}
