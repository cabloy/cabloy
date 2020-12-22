window["a-instance"]=(()=>{var e={788:(e,n,t)=>{"use strict";t.d(n,{Z:()=>r});const r={}},978:(e,n,t)=>{"use strict";t.d(n,{Z:()=>r});const r={Config:"配置",Instance:"实例",Preview:"预览",Subdomain:"子域名",Title:"标题",Empty:"空","Reload Instance":"重新加载实例"}},137:(e,n,t)=>{"use strict";t.d(n,{Z:()=>r});const r={"zh-cn":t(978).Z}},292:(e,n,t)=>{"use strict";var r;t.r(n),t.d(n,{default:()=>o}),t(191);const o={install:function(e,n){return r?console.error("already installed."):(r=e,n({routes:t(644).Z,store:t(81).Z(r),config:t(788).Z,locales:t(137).Z}))}}},644:(e,n,t)=>{"use strict";function r(e){return t(142)("./".concat(e,".vue")).default}t.d(n,{Z:()=>o});const o=[{path:"instance/config",component:r("instance/config")},{path:"instance/configPreview",component:r("instance/configPreview")}]},81:(e,n,t)=>{"use strict";function r(e){return{state:{},getters:{},mutations:{},actions:{}}}t.d(n,{Z:()=>r})},415:(e,n,t)=>{var r=t(233),o=t(361)(r);o.push([e.id,".config-edit[data-v-6fea243a] {\n  width: 100%;\n  height: 400px;\n}\n","",{version:3,sources:["webpack://./front/src/pages/instance/config.vue","webpack://./config.vue"],names:[],mappings:"AAmEA;EACE,WAAA;EACA,aAAA;AClEF",sourcesContent:["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.config-edit {\n  width: 100%;\n  height: 400px;\n}\n\n",".config-edit {\n  width: 100%;\n  height: 400px;\n}\n"],sourceRoot:""}]),e.exports=o},320:(e,n,t)=>{var r=t(233),o=t(361)(r);o.push([e.id,"\n","",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]),e.exports=o},361:e=>{"use strict";e.exports=function(e){var n=[];return n.toString=function(){return this.map((function(n){var t=e(n);return n[2]?"@media ".concat(n[2]," {").concat(t,"}"):t})).join("")},n.i=function(e,t,r){"string"==typeof e&&(e=[[null,e,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var s=0;s<e.length;s++){var c=[].concat(e[s]);r&&o[c[0]]||(t&&(c[2]?c[2]="".concat(t," and ").concat(c[2]):c[2]=t),n.push(c))}},n}},233:e=>{"use strict";function n(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}e.exports=function(e){var t,r,o=(r=4,function(e){if(Array.isArray(e))return e}(t=e)||function(e,n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(r=(a=s.next()).done)&&(t.push(a.value),!n||t.length!==n);r=!0);}catch(e){o=!0,i=e}finally{try{r||null==s.return||s.return()}finally{if(o)throw i}}return t}}(t,r)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),i=o[1],a=o[3];if("function"==typeof btoa){var s=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(s),u="/*# ".concat(c," */"),f=a.sources.map((function(e){return"/*# sourceURL=".concat(a.sourceRoot||"").concat(e," */")}));return[i].concat(f).concat([u]).join("\n")}return[i].join("\n")}},924:(e,n,t)=>{"use strict";function r(e,n,t,r,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void t(e)}s.done?n(c):Promise.resolve(c).then(r,o)}function o(e){return function(){var n=this,t=arguments;return new Promise((function(o,i){var a=e.apply(n,t);function s(e){r(a,o,i,s,c,"next",e)}function c(e){r(a,o,i,s,c,"throw",e)}s(void 0)}))}}t.r(n),t.d(n,{default:()=>a});const i={data:function(){return{instance:null}},created:function(){var e=this;this.$api.post("instance/item").then((function(n){n.config=window.JSON5.stringify(JSON.parse(n.config||"{}"),null,2),e.instance=n}))},methods:{onPerformValidate:function(){var e=this;return o(regeneratorRuntime.mark((function n(){var t;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return(t=e.$utils.extend({},e.instance)).config=JSON.stringify(window.JSON5.parse(t.config||"{}")),n.next=4,e.$api.post("instance/save",{data:t});case 4:return e.$emit("preview"),e.$store.commit("auth/setInstance",{name:e.instance.name,title:e.instance.title}),window.document.title=e.$store.getters["auth/title"],n.abrupt("return",!0);case 8:case"end":return n.stop()}}),n)})))()},onPerformSave:function(){return this.$refs.validate.perform()},onPerformPreview:function(){this.$view.navigate("/a/instance/instance/configPreview",{context:{params:{source:this}}})},onSubmit:function(){this.$refs.buttonSubmit.onClick()},onPerformReload:function(){var e=this;return o(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.$view.dialog.confirm();case 2:return n.next=4,e.$api.post("instance/reload");case 4:return n.abrupt("return",!0);case 5:case"end":return n.stop()}}),n)})))()}}};t(125);const a=(0,t(792).Z)(i,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("eb-page",[t("eb-navbar",{attrs:{large:"",largeTransparent:"",title:e.$text("Instance"),"eb-back-link":"Back"}},[t("f7-nav-right",[t("eb-link",{ref:"buttonSubmit",attrs:{iconMaterial:"save",onPerform:e.onPerformSave}}),e._v(" "),t("eb-link",{attrs:{iconMaterial:"visibility",onPerform:e.onPerformPreview}})],1)],1),e._v(" "),e.instance?t("eb-validate",{ref:"validate",attrs:{auto:!0,data:e.instance,params:{module:"a-instance",validator:"instance"},onPerform:e.onPerformValidate},on:{submit:e.onSubmit}}):e._e(),e._v(" "),t("f7-toolbar",{attrs:{"bottom-md":""}},[t("eb-link",{attrs:{onPerform:e.onPerformReload}},[e._v(e._s(e.$text("Reload Instance")))])],1)],1)}),[],!1,null,"6fea243a",null).exports},478:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>i});const r=window.Vue,o={meta:{size:"medium"},mixins:[t.n(r)().prototype.$meta.module.get("a-components").options.mixins.ebPageContext],data:function(){return{content:"{}"}},computed:{params:function(){return this.contextParams},source:function(){return this.contextParams&&this.contextParams.source}},created:function(){this.onLoad()},mounted:function(){this.source&&this.source.$on("preview",this.onPreview)},beforeDestroy:function(){this.source&&this.source.$off("preview",this.onPreview)},methods:{onPreview:function(){this.onLoad()},onLoad:function(){var e=this;this.$api.post("instance/getConfigsPreview").then((function(n){n.data?e.content=JSON5.stringify(n.data,null,2):e.content="{}"}))},onSize:function(e){this.$$(this.$refs.textarea).css({height:"".concat(e.height-20,"px"),width:"".concat(e.width-20,"px")})}}},i=(0,t(792).Z)(o,(function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("eb-page",[t("eb-navbar",{attrs:{title:e.$text("Preview"),"eb-back-link":"Back"}}),e._v(" "),t("eb-box",{on:{size:e.onSize}},[t("textarea",{ref:"textarea",staticClass:"json-textarea json-textarea-margin",attrs:{type:"textarea",readonly:"readonly"},domProps:{value:e.content}})])],1)}),[],!1,null,null,null).exports},792:(e,n,t)=>{"use strict";function r(e,n,t,r,o,i,a,s){var c,u="function"==typeof e?e.options:e;if(n&&(u.render=n,u.staticRenderFns=t,u._compiled=!0),r&&(u.functional=!0),i&&(u._scopeId="data-v-"+i),a?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(a)},u._ssrRegister=c):o&&(c=s?function(){o.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:o),c)if(u.functional){u._injectStyles=c;var f=u.render;u.render=function(e,n){return c.call(n),f(e,n)}}else{var l=u.beforeCreate;u.beforeCreate=l?[].concat(l,c):[c]}return{exports:e,options:u}}t.d(n,{Z:()=>r})},125:(e,n,t)=>{var r=t(415);"string"==typeof r&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals),(0,t(159).Z)("35b467ea",r,!0,{})},191:(e,n,t)=>{var r=t(320);"string"==typeof r&&(r=[[e.id,r,""]]),r.locals&&(e.exports=r.locals),(0,t(159).Z)("a09693da",r,!0,{})},159:(e,n,t)=>{"use strict";function r(e,n){for(var t=[],r={},o=0;o<n.length;o++){var i=n[o],a=i[0],s={id:e+":"+o,css:i[1],media:i[2],sourceMap:i[3]};r[a]?r[a].parts.push(s):t.push(r[a]={id:a,parts:[s]})}return t}t.d(n,{Z:()=>v});var o="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var i={},a=o&&(document.head||document.getElementsByTagName("head")[0]),s=null,c=0,u=!1,f=function(){},l=null,d="data-vue-ssr-id",p="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function v(e,n,t,o){u=t,l=o||{};var a=r(e,n);return h(a),function(n){for(var t=[],o=0;o<a.length;o++){var s=a[o];(c=i[s.id]).refs--,t.push(c)}for(n?h(a=r(e,n)):a=[],o=0;o<t.length;o++){var c;if(0===(c=t[o]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete i[c.id]}}}}function h(e){for(var n=0;n<e.length;n++){var t=e[n],r=i[t.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](t.parts[o]);for(;o<t.parts.length;o++)r.parts.push(g(t.parts[o]));r.parts.length>t.parts.length&&(r.parts.length=t.parts.length)}else{var a=[];for(o=0;o<t.parts.length;o++)a.push(g(t.parts[o]));i[t.id]={id:t.id,refs:1,parts:a}}}}function m(){var e=document.createElement("style");return e.type="text/css",a.appendChild(e),e}function g(e){var n,t,r=document.querySelector("style["+d+'~="'+e.id+'"]');if(r){if(u)return f;r.parentNode.removeChild(r)}if(p){var o=c++;r=s||(s=m()),n=w.bind(null,r,o,!1),t=w.bind(null,r,o,!0)}else r=m(),n=x.bind(null,r),t=function(){r.parentNode.removeChild(r)};return n(e),function(r){if(r){if(r.css===e.css&&r.media===e.media&&r.sourceMap===e.sourceMap)return;n(e=r)}else t()}}var b,y=(b=[],function(e,n){return b[e]=n,b.filter(Boolean).join("\n")});function w(e,n,t,r){var o=t?"":r.css;if(e.styleSheet)e.styleSheet.cssText=y(n,o);else{var i=document.createTextNode(o),a=e.childNodes;a[n]&&e.removeChild(a[n]),a.length?e.insertBefore(i,a[n]):e.appendChild(i)}}function x(e,n){var t=n.css,r=n.media,o=n.sourceMap;if(r&&e.setAttribute("media",r),l.ssrId&&e.setAttribute(d,n.id),o&&(t+="\n/*# sourceURL="+o.sources[0]+" */",t+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */"),e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},142:(e,n,t)=>{var r={"./instance/config.vue":924,"./instance/configPreview.vue":478};function o(e){var n=i(e);return t(n)}function i(e){if(!t.o(r,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return r[e]}o.keys=function(){return Object.keys(r)},o.resolve=i,e.exports=o,o.id=142}},n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={id:r,exports:{}};return e[r](o,o.exports,t),o.exports}return t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t(292)})();
//# sourceMappingURL=front.js.map