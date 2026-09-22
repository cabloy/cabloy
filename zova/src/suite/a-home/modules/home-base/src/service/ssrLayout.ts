import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';
import { getBodyReadyObserverScript } from 'zova-module-a-ssr';

export interface IServiceSsrLayoutOptions {
  bodyReadyObserver?: boolean;
  sidebarWidth?: number;
  sidebarBreakpoint?: number;
  sidebarLeftOpenPCCapability?: boolean;
  sidebarLeftOpenPCFallback?: boolean;
}

@Service()
export class ServiceSsrLayout extends BeanBase {
  options?: IServiceSsrLayoutOptions;

  protected async __init__(options?: IServiceSsrLayoutOptions) {
    this.options = options;
    // ssr theme
    if (process.env.SERVER) {
      this.ctx.meta.$ssr.context.onRendered((err?: Error) => {
        if (err) return;
        if (!this.$ssr.profileOptions.useCookie) {
          // Apply the final browser-selected theme from the SSR dual markers as early as possible.
          this.ctx.meta.$ssr.context._meta.bodyTags += `<script id="__prefersColorSchemeDarkJS">
            document.body.setAttribute('data-theme', window.ssr_themedark_data);
            if(window.ssr_local_themename==='home-theme:orange'){
              document.body.style.setProperty('--color-primary', '#f28238');
            }
            document.querySelector('#__prefersColorSchemeDarkJS').remove();
          </script>`.replaceAll('\n', '');
        }
        if (this.options?.bodyReadyObserver) {
          this.ctx.meta.$ssr.context.__qMetaList.push({
            bodyStyle: { display: 'none' },
          });
          this.ctx.meta.$ssr.context._meta.bodyTags +=
            `<script id="__leftDrawerOpenJS">
  ${this.options?.sidebarLeftOpenPCCapability ? this._getJsHandlerSidebar() : ''}
  ${this._getJsHandlerPageContainer()}
  window.ssr_body_ready_handler=__targets=>{
    ${this.options?.sidebarLeftOpenPCCapability ? 'window.ssr_body_ready_handler_sidebar(__targets);' : ''}
    window.ssr_body_ready_handler_pageContainer(__targets);
  };
  window.ssr_body_ready_condition=()=>{
    const __domDrawerContainer=document.querySelector('#q-app>.drawer');
    const __domPageContainer=document.querySelector('#q-app>.drawer>.drawer-content');
    ${this.options?.sidebarLeftOpenPCCapability ? "const __domDrawer=document.querySelector('#q-app>.drawer>.drawer-side');" : ''}
    return __domDrawerContainer&&__domPageContainer${this.options?.sidebarLeftOpenPCCapability ? '&&__domDrawer' : ''}?{
      drawerContainer:__domDrawerContainer,
      pageContainer:__domPageContainer,
      ${this.options?.sidebarLeftOpenPCCapability ? 'drawer:__domDrawer,' : ''}
    }:undefined;
  };
  window.ssr_body_ready_callback=__targets=>{
    try{
      window.ssr_body_ready_handler(__targets);
    }finally{
      document.querySelector('#__leftDrawerOpenJS')?.remove();
    }
  };
</script>`.replaceAll('\n', '') + getBodyReadyObserverScript();
        }
      });
    }
  }

  private _getJsHandlerPageContainer() {
    return `window.ssr_body_ready_handler_pageContainer=()=>{
  };`;
  }

  private _getJsHandlerSidebar() {
    return `window.ssr_body_ready_handler_sidebar=__targets=>{
      const __belowBreakpoint=document.documentElement.clientWidth <= ${this.options?.sidebarBreakpoint};
      let __leftDrawerOpen;
      if(__belowBreakpoint){
        __leftDrawerOpen=false;
      }else{
        const __leftDrawerOpenPC=window.ssr_load_local('sidebarLeftOpenPC');
        __leftDrawerOpen=__leftDrawerOpenPC!==undefined?__leftDrawerOpenPC:${this.options?.sidebarLeftOpenPCFallback ?? false};
      }
      const __domDrawerContainer=__targets?.drawerContainer;
      const __domDrawer=__targets?.drawer;
      if(!__domDrawerContainer||!__domDrawer)return;
      if(__leftDrawerOpen){
        __domDrawer.style.transform='translateX(0px)';
        ${this.options?.sidebarWidth !== undefined ? `__domDrawer.style.width='${this.options.sidebarWidth}px';` : ''}
        __domDrawerContainer.classList.add('drawer-open');
      }else{
      }
    };`;
  }
}
