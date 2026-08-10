export function getBodyReadyObserverScript() {
  return `<script id="ssr-body-ready-observer">
        window.ssr_bodyReadyObserverClear=()=>{
          if(window.ssr_bodyReadyObserver){
            window.ssr_body_ready_condition=undefined;
            window.ssr_body_ready_callback=undefined;
            window.ssr_bodyReadyObserver.disconnect();
            window.ssr_bodyReadyObserver=undefined;
            document.body.style.display='block';
            document.querySelector('#ssr-body-ready-observer').remove();
          }
        };
        window.ssr_bodyReadyObserver = new MutationObserver(() => {
          if(window.ssr_body_ready_condition && window.ssr_body_ready_condition()){
            window.ssr_body_ready_callback();
            window.ssr_bodyReadyObserverClear();
          }
        });
        window.ssr_bodyReadyObserver.observe(document.body, {
          subtree: true,
          childList: true,
        });
        document.addEventListener("DOMContentLoaded", () => {
          window.ssr_bodyReadyObserverClear();
        });
      </script>`.replaceAll('\\n', '');
}
