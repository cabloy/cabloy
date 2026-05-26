import { BeanBase, UseScope } from 'zova';
import { Service } from 'zova-module-a-bean';
import { ScopeModuleASsr } from 'zova-module-a-ssr';

export interface IServiceSsrLayoutOptions {
  sidebarLeftOpenPC?: boolean;
}

@Service()
export class ServiceSsrLayout extends BeanBase {
  @UseScope()
  $$scopeSsr: ScopeModuleASsr;

  options?: IServiceSsrLayoutOptions;

  protected async __init__(options?: IServiceSsrLayoutOptions) {
    this.options = options;
    // ssr theme
    if (process.env.SERVER) {
      this.ctx.meta.$ssr.context.onRendered((err?: Error) => {
        if (err) return;
        if (!this.sys.config.ssr.cookie) {
          this.ctx.meta.$ssr.context._meta.bodyTags += `<script id="__prefersColorSchemeDarkJS">
            document.body.setAttribute('data-theme', window.ssr_themedark_data);
            if(window.ssr_local_themename==='home-theme:orange'){
              document.body.style.setProperty('--color-primary', '#f28238');
            }
            document.querySelector('#__prefersColorSchemeDarkJS').remove();
          </script>`.replaceAll('\n', '');
        }
        if (this.$$scopeSsr.config.optimization.bodyReadyObserver) {
          this.ctx.meta.$ssr.context._meta.bodyTags += `<script id="__leftDrawerOpenJS">
  ${this.options?.sidebarLeftOpenPC ? this._getJsHandlerSidebar() : ''}
  ${this._getJsHandlerPageContainer()}
  window.ssr_body_ready_handler=()=>{
    ${this.options?.sidebarLeftOpenPC ? 'window.ssr_body_ready_handler_sidebar();' : ''}
    window.ssr_body_ready_handler_pageContainer();
  };
  window.ssr_body_ready_condition=()=>{
    const __domPageContainer=document.querySelector('#q-app>.drawer>.drawer-content');
    return __domPageContainer;
  };
  window.ssr_body_ready_callback=()=>{
    window.ssr_body_ready_handler();
    document.querySelector('#__leftDrawerOpenJS').remove();
  };
</script>`.replaceAll('\n', '');
        }
      });
    }
  }

  private _getJsHandlerPageContainer() {
    return `window.ssr_body_ready_handler_pageContainer=()=>{
  };`;
  }

  private _getJsHandlerSidebar() {
    return `window.ssr_body_ready_handler_sidebar=()=>{
      const __belowBreakpoint=document.documentElement.clientWidth <= ${this.sys.config.layout.sidebar.breakpoint};
      let __leftDrawerOpen;
      if(__belowBreakpoint){
        __leftDrawerOpen=false;
      }else{
        const __leftDrawerOpenPC=window.ssr_load_local('sidebarLeftOpenPC');
        __leftDrawerOpen=__leftDrawerOpenPC!==undefined?__leftDrawerOpenPC:${this.sys.config.layout.sidebar.leftOpenPC};
      }
      const __domDrawerContainer=document.querySelector('#q-app>.drawer');
      const __domDrawer=document.querySelector('#q-app>.drawer>.drawer-side');
      const sidebarWidth = '${this.scope.config.layout.sidebar.width}px';
      const navbarHeight = '${this.scope.config.layout.navbar.height}px';
      if(__leftDrawerOpen){
        __domDrawer.style.transform='translateX(0px)';
        __domDrawer.style.width=sidebarWidth;
        __domDrawerContainer.classList.add('drawer-open');
      }else{
      }
    };`;
  }
}
