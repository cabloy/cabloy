// from: quasar/ui/src/plugins/Meta.js
import { extend } from '@cabloy/extend';
import { BeanSimple, cast } from 'zova';

import type { SSRContext, SSRMetaOptions, SSRMetaOptionsWrapper } from '../types/ssr.js';

import { unevalPatch } from './utils.js';

export class CtxSSRMetaStore extends BeanSimple {
  private _updateId: number = 0;
  private _currentClientMeta?: SSRMetaOptions;
  private _clientList: SSRMetaOptionsWrapper[] = [];

  protected __init__() {
    if (process.env.SERVER) {
      const ssrContext = this.ctx.meta.$ssr.context;
      ssrContext.__qMetaList = [];
      if (this.sys.env.SSR_BODYREADYOBSERVER === 'true') {
        ssrContext.__qMetaList.push({
          bodyStyle: { display: 'none' },
        });
      }
      ssrContext.rendered = () => {
        this._onRenderedLast();
        ssrContext.rendered = () => {};
      };
    }
    if (process.env.CLIENT && this.ctx.meta.$ssr.isRuntimeSsrPreHydration) {
      this._currentClientMeta = cast(window).__Q_META__;
      document.getElementById('ssr-meta-init')?.remove();
    }
  }

  private _onRenderedLast(err?: Error) {
    if (!err) {
      const ssrContext = this.ctx.meta.$ssr.context;
      this._injectContextState(ssrContext);
      this._injectContextStateDefer(ssrContext);
      this._injectServerMeta(ssrContext);
    }
    this.app.close();
  }

  addMetaOptions(metaOptionsWrapper: SSRMetaOptionsWrapper) {
    this._clientList.push(metaOptionsWrapper);
  }

  removeMetaOptions(metaOptionsWrapper: SSRMetaOptionsWrapper) {
    this._clientList.splice(this._clientList.indexOf(metaOptionsWrapper), 1);
  }

  planClientUpdate() {
    if (this._updateId !== 0) {
      clearTimeout(this._updateId);
    }
    this._updateId = window.setTimeout(() => {
      this._updateId = 0;
      this._updateClientMeta();
    }, 50);
  }

  private _updateClientMeta() {
    const data: SSRMetaOptions = {
      title: '',
      titleTemplate: undefined,
      meta: {},
      link: {},
      script: {},
      htmlAttr: {},
      bodyAttr: {},
    };

    for (let i = 0; i < this._clientList.length; i++) {
      const { active, val } = this._clientList[i];

      if (active === true) {
        extend(true, data, val);
      }
    }

    normalize(data);

    apply(diff(this._currentClientMeta, data));
    this._currentClientMeta = data;
  }

  private _injectServerMeta(ssrContext: SSRContext) {
    const data: SSRMetaOptions = {
      title: '',
      titleTemplate: undefined,
      meta: {},
      link: {},
      htmlAttr: {},
      bodyAttr: {},
      bodyStyle: {},
      bodyClass: {},
      noscript: {},
    };

    const list = ssrContext.__qMetaList;

    for (let i = 0; i < list.length; i++) {
      extend(true, data, list[i]);
    }

    normalize(data);

    const nonce = ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : '';

    const ctx = ssrContext._meta;

    const htmlAttr = Object.keys(data.htmlAttr!).filter(htmlFilter);

    if (htmlAttr.length !== 0) {
      ctx.htmlAttrs +=
        (ctx.htmlAttrs.length !== 0 ? ' ' : '') + htmlAttr.map(getAttr(data.htmlAttr)).join(' ');
    }

    ctx.headTags += getHead(data);

    const bodyAttr = Object.keys(data.bodyAttr!).filter(bodyFilter);

    if (bodyAttr.length !== 0) {
      ctx.bodyAttrs +=
        (ctx.bodyAttrs.length !== 0 ? ' ' : '') + bodyAttr.map(getAttr(data.bodyAttr)).join(' ');
    }

    const bodyStyle = Object.keys(data.bodyStyle!)
      .filter(name => !!data.bodyStyle![name])
      .map(name => `${name}:${data.bodyStyle![name]};`)
      .join('');
    if (bodyStyle) {
      ctx.bodyAttrs += `${ctx.bodyAttrs.length !== 0 ? ' ' : ''}style="${bodyStyle}"`;
    }

    const _bodyClass = ctx.bodyClasses.split(' ').filter(item => !!item);
    const bodyClass = {};
    _bodyClass.forEach(item => (bodyClass[item] = true));
    extend(true, bodyClass, data.bodyClass);
    ctx.bodyClasses = Object.keys(bodyClass)
      .filter(name => bodyClass[name])
      .map(name => name)
      .join(' ');

    data.title = '\'"`';

    ctx.endingHeadTags += `${Object.keys(data.noscript!)
      .map(name => `<noscript data-qmeta="${name}">${data.noscript![name]}</noscript>`)
      .join(
        '',
      )}<script${nonce} id="ssr-meta-init">window.__Q_META__=${delete data.bodyStyle && delete data.bodyClass && delete data.noscript && unevalPatch(data)}</script>`;

    let ssr_local_themedark = this.sys.config.ssr.cookie
      ? `let ssr_cookie_themedark=document.cookie.split('; ')?.find(item=>item.indexOf('themedark=')>-1)?.split('=')[1];
        ssr_cookie_themedark=ssr_cookie_themedark==='true'?true:ssr_cookie_themedark==='false'?false:${this.sys.env.SSR_COOKIE_THEMEDARK_DEFAULT};
        window.ssr_themedark=window.ssr_cookie_themedark=ssr_cookie_themedark;`
      : `let ssr_local_themedark=window.ssr_load_local('themedark');
        if(ssr_local_themedark===undefined || ssr_local_themedark==='auto'){
          ssr_local_themedark=window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        window.ssr_themedark=window.ssr_local_themedark=ssr_local_themedark;`;
    ssr_local_themedark += `Object.defineProperty(window, 'ssr_themedark_data', {
          get: () => {
            let _data=document.body.getAttribute('data-ssr-theme-dark-'+window.ssr_themedark);
            if(_data===undefined || _data===null){
              _data=window.__INITIAL_STATE__ && window.__INITIAL_STATE__['data-ssr-theme-dark-'+window.ssr_themedark];
            }
            return _data;
          },
        });`;
    const ssr_local_themename = this.sys.config.ssr.cookie
      ? ''
      : "window.ssr_local_themename=window.ssr_load_local('themename');";
    ctx.endingHeadTags += `<script id="ssr-prefers-color-schema-dark">
        window.ssr_load_local=function(key){
          const __ssr_local=localStorage.getItem(key);
          return __ssr_local?JSON.parse(__ssr_local):undefined;
        };
        ${ssr_local_themedark}
        ${ssr_local_themename}
        document.querySelector('#ssr-prefers-color-schema-dark').remove();
    </script>`.replaceAll('\n', '');

    if (this.sys.env.SSR_BODYREADYOBSERVER === 'true') {
      ctx.bodyTags += `<script id="ssr-body-ready-observer">
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
      </script>`.replaceAll('\n', '');
    }
  }

  private _injectContextState(ssrContext: SSRContext) {
    const ctx = ssrContext._meta;

    const nonce = ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : '';

    ctx.endingHeadTags += `<script${nonce} id="ssr-state-init">window.__INITIAL_STATE__=${unevalPatch(ssrContext.state)}</script>`;
  }

  private _injectContextStateDefer(ssrContext: SSRContext) {
    const ctx = ssrContext._meta;

    const nonce = ssrContext.nonce !== void 0 ? ` nonce="${ssrContext.nonce}"` : '';

    ctx.endingBodyTags += `<script${nonce} id="ssr-state-defer-init">window.__INITIAL_STATE_DEFER__=${unevalPatch(ssrContext.stateDefer)}</script>`;
  }
}

function normalize(meta) {
  if (meta.title) {
    meta.title = meta.titleTemplate ? meta.titleTemplate(meta.title) : meta.title;
    delete meta.titleTemplate;
  }

  [
    ['meta', 'content'],
    ['link', 'href'],
  ].forEach(type => {
    const metaType = meta[type[0]];
    const metaProp = type[1];

    for (const name in metaType) {
      const metaLink = metaType[name];

      if (metaLink.template) {
        if (Object.keys(metaLink).length === 1) {
          delete metaType[name];
        } else {
          metaLink[metaProp] = metaLink.template(metaLink[metaProp] || '');
          delete metaLink.template;
        }
      }
    }
  });
}

function changed(old, def) {
  if (Object.keys(old).length !== Object.keys(def).length) {
    return true;
  }
  for (const key in old) {
    if (old[key] !== def[key]) {
      return true;
    }
  }
}

function bodyFilter(name) {
  return ['class', 'style'].includes(name) === false;
}

function htmlFilter(_name) {
  return true;
  // return ['lang', 'dir'].includes(name) === false;
}

function diff(meta, other) {
  const add: any = {};
  const remove: any = {};

  if (meta === void 0) {
    return { add: other, remove };
  }

  if (meta.title !== other.title) {
    add.title = other.title;
  }

  ['meta', 'link', 'script', 'htmlAttr', 'bodyAttr'].forEach(type => {
    const old = meta[type];
    const cur = other[type];
    remove[type] = [];

    if (old === void 0 || old === null) {
      add[type] = cur;
      return;
    }

    add[type] = {};

    for (const key in old) {
      if (Object.prototype.hasOwnProperty.call(cur, key) === false) {
        remove[type].push(key);
      }
    }
    for (const key in cur) {
      if (Object.prototype.hasOwnProperty.call(old, key) === false) {
        add[type][key] = cur[key];
      } else if (changed(old[key], cur[key]) === true) {
        remove[type].push(key);
        add[type][key] = cur[key];
      }
    }
  });

  return { add, remove };
}

function apply({ add, remove }) {
  if (add.title) {
    document.title = add.title;
  }

  if (Object.keys(remove).length !== 0) {
    ['meta', 'link', 'script'].forEach(type => {
      remove[type].forEach(name => {
        document.head.querySelector(`${type}[data-qmeta="${name}"]`)?.remove();
      });
    });
    remove.htmlAttr.filter(htmlFilter).forEach(name => {
      document.documentElement.removeAttribute(name);
    });
    remove.bodyAttr.filter(bodyFilter).forEach(name => {
      document.body.removeAttribute(name);
    });
  }

  ['meta', 'link', 'script'].forEach(type => {
    const metaType = add[type];

    for (const name in metaType) {
      const tag = document.createElement(type);
      for (const att in metaType[name]) {
        if (att !== 'innerHTML') {
          tag.setAttribute(att, metaType[name][att]);
        }
      }
      tag.setAttribute('data-qmeta', name);
      if (type === 'script') {
        tag.innerHTML = metaType[name].innerHTML || '';
      }
      document.head.appendChild(tag);
    }
  });
  Object.keys(add.htmlAttr)
    .filter(htmlFilter)
    .forEach(name => {
      document.documentElement.setAttribute(name, add.htmlAttr[name] || '');
    });
  Object.keys(add.bodyAttr)
    .filter(bodyFilter)
    .forEach(name => {
      document.body.setAttribute(name, add.bodyAttr[name] || '');
    });
}

function getAttr(seed) {
  return att => {
    const val = seed[att];
    return att + (val !== true && val !== void 0 ? `="${val}"` : '');
  };
}

function getHead(meta) {
  let output = '';
  if (meta.title) {
    output += `<title>${meta.title}</title>`;
  }
  ['meta', 'link', 'script'].forEach(type => {
    const metaType = meta[type];

    for (const att in metaType) {
      const attrs = Object.keys(metaType[att])
        .filter(att => att !== 'innerHTML')
        .map(getAttr(metaType[att]));

      output += `<${type} ${attrs.join(' ')} data-qmeta="${att}">`;
      if (type === 'script') {
        output += `${metaType[att].innerHTML || ''}</script>`;
      }
    }
  });
  return output;
}
