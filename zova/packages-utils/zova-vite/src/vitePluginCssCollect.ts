import { SymbolCssResult } from './collect-css-ssr.ts';

// eslint-disable-next-line
const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;
const isCSSRequest = request => CSS_LANGS_RE.test(request);
const commonjsProxyRE = /\?commonjs-proxy/;
const SPECIAL_QUERY_RE = /[?&](?:worker|sharedworker|raw|url)\b/;

export function cssCollectPlugin(_config: any) {
  return {
    name: 'zova:csscollect',
    apply: 'serve',
    async transform(this: any, raw, id) {
      if (!isCSSRequest(id) || commonjsProxyRE.test(id) || SPECIAL_QUERY_RE.test(id)) {
        return;
      }
      const { environment } = this;
      if (this.environment.config.consumer === 'server') {
        const mod = environment.moduleGraph.getModuleById(id);
        mod[SymbolCssResult] = raw;
      }
    },
  };
}
