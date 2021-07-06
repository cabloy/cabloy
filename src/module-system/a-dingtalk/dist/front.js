(()=>{var t={332:(t,e,n)=>{"use strict";function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function s(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){o(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}n.d(e,{Z:()=>a});const a={data:function(){return{syncStatus:null}},created:function(){var t=this;this.$api.post("contacts/syncStatus").then((function(e){t.syncStatus=e}))},mounted:function(){this.$meta.eventHub.$on("dingtalk:contacts:sync",this.onStatusChanged)},beforeDestroy:function(){this.$meta.eventHub.$off("dingtalk:contacts:sync",this.onStatusChanged)},methods:{onStatusChanged:function(t){this.syncStatus=s(s({},this.syncStatus),t)}}}},475:(t,e,n)=>{"use strict";function r(t,e,n,r,s,o,a){try{var i=t[o](a),c=i.value}catch(t){return void n(t)}i.done?e(c):Promise.resolve(c).then(r,s)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(s,o){var a=t.apply(e,n);function i(t){r(a,s,o,i,c,"next",t)}function c(t){r(a,s,o,i,c,"throw",t)}i(void 0)}))}}n.d(e,{Z:()=>d});const o={meta:{global:!1,disable:function(t){var e=this;return s(regeneratorRuntime.mark((function n(){var r,s;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(r=t.ctx,s=t.state,r.$device.dingtalk){n.next=3;break}return n.abrupt("return",!0);case 3:if("associate"!==s){n.next=5;break}return n.abrupt("return",!1);case 5:if(!r.$store.state.auth.reload){n.next=8;break}return n.abrupt("return",!1);case 8:return n.prev=8,n.next=11,e.login({ctx:r,state:s});case 11:n.next=17;break;case 13:return n.prev=13,n.t0=n.catch(8),r.$view.toast.show({text:n.t0.message}),n.abrupt("return",!1);case 17:throw new Error;case 18:case"end":return n.stop()}}),n,null,[[8,13]])})))()},login:function(t){return s(regeneratorRuntime.mark((function e(){var n,r,s,o,a,i;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.ctx,r=t.state,t.hash,s={actionModule:"a-dingtalk",actionComponent:"jssdk",name:"config"},e.next=4,n.$meta.util.performAction({ctx:n,action:s});case 4:return o=e.sent,a=o.dd,i=o.config,e.abrupt("return",new Promise((function(t,e){a.runtime.permission.requestAuthCode({corpId:i.corpId,onSuccess:function(s){var o=s.code;n.$api.post("/a/dingtalk/auth/login",{scene:"dingtalk",code:o,state:r}).then((function(){n.$meta.vueApp.reload({echo:!0}),t()})).catch((function(t){e(t)}))},onFail:function(t){e(new Error(t.errorMessage||t.message))}})})));case 8:case"end":return e.stop()}}),e)})))()}},data:function(){return{}},methods:{onPerformSignIn:function(){return this.$options.meta.login({ctx:this})}}};var a=n(792);const i=(0,a.Z)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("eb-button",{attrs:{onPerform:t.onPerformSignIn}},[r("img",{attrs:{src:n(179)}})])}),[],!1,null,"047989fe",null).exports;function c(t,e,n,r,s,o,a){try{var i=t[o](a),c=i.value}catch(t){return void n(t)}i.done?e(c):Promise.resolve(c).then(r,s)}const u={meta:{global:!1,disable:function(t){return(e=regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.ctx,t.state,!n.$meta.config.base.jwt){e.next=3;break}return e.abrupt("return",!0);case 3:if(!(n.$device.iphone||n.$device.android||n.$device.dingtalk)){e.next=5;break}return e.abrupt("return",!0);case 5:return e.abrupt("return",!1);case 6:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(r,s){var o=e.apply(t,n);function a(t){c(o,r,s,a,i,"next",t)}function i(t){c(o,r,s,a,i,"throw",t)}a(void 0)}))})();var e},login:function(t){var e=t.ctx,n=t.state,r=t.hash;e.$meta.vueApp.toLogin({url:"/api/a/dingtalk/passport/a-dingtalk/dingtalkweb",state:n,hash:r})}},data:function(){return{}},methods:{onPerformSignIn:function(){this.$options.meta.login({ctx:this})}}},l=(0,a.Z)(u,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("eb-button",{attrs:{onPerform:t.onPerformSignIn}},[r("img",{attrs:{src:n(179)}})])}),[],!1,null,"af1b2eba",null).exports;var f=null;const d={buttondingtalk:i,buttondingtalkweb:l,jssdk:{meta:{global:!1},methods:{onAction:function(t){var e=t.ctx;if("config"===t.action.name)return this._createConfig({ctx:e})},_createConfig:function(){var t=this;return this.$device.dingtalk?f?Promise.resolve(f):new Promise((function(e,n){t.$meta.util.loadScript(t.$config.jssdk.url.dingtalk,(function(){var r=location.href.split("#")[0];t._jsconfig(r).then((function(t){f={dd:window.dd,config:t},e(f)})).catch((function(t){return n(t)}))}))})):Promise.resolve(null)},_jsconfig:function(t){var e=this;return new Promise((function(n,r){e.$api.post("jssdk/jsconfig",{url:t}).then((function(t){window.dd.config(t),window.dd.error((function(t){r(t.errMsg)})),window.dd.ready((function(){n(t)}))})).catch((function(t){r(t)}))}))}}}}},788:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={jssdk:{url:{dingtalk:"https://g.alicdn.com/dingding/dingtalk-jsapi/2.10.3/dingtalk.open.js"}}}},933:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={SendLinkAccountMigration:"Account Migration(Auto Send Link)"}},978:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={DingTalk:"钉钉",Department:"部门",Departments:"部门",Member:"成员",Members:"成员",Sync:"同步",Options:"选项",Synchronized:"已同步",SendLinkAccountMigration:"账户迁移(自动发送链接)","Contacts Management":"通讯录管理","Sync Remote -> Local":"同步 远程 -> 本地","Sync Now":"现在同步","Sync Again":"再次同步","Not Synchronized":"未同步"}},137:(t,e,n)=>{"use strict";n.d(e,{Z:()=>r});const r={"en-us":n(933).Z,"zh-cn":n(978).Z}},644:(t,e,n)=>{"use strict";function r(t){return n(142)("./".concat(t,".vue")).default}n.d(e,{Z:()=>s});const s=[{path:"contacts/management",component:r("contacts/management")},{path:"contacts/sync",component:r("contacts/sync")}]},81:(t,e,n)=>{"use strict";function r(t){return{state:{},getters:{},mutations:{},actions:{}}}n.d(e,{Z:()=>r})},891:(t,e,n)=>{var r=n(233),s=n(361)(r);s.push([t.id,"","",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]),t.exports=s},361:t=>{"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=t(e);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,r){"string"==typeof t&&(t=[[null,t,""]]);var s={};if(r)for(var o=0;o<this.length;o++){var a=this[o][0];null!=a&&(s[a]=!0)}for(var i=0;i<t.length;i++){var c=[].concat(t[i]);r&&s[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},233:t=>{"use strict";function e(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}t.exports=function(t){var n,r,s=(r=4,function(t){if(Array.isArray(t))return t}(n=t)||function(t,e){var n=t&&("undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]);if(null!=n){var r,s,o=[],a=!0,i=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(o.push(r.value),!e||o.length!==e);a=!0);}catch(t){i=!0,s=t}finally{try{a||null==n.return||n.return()}finally{if(i)throw s}}return o}}(n,r)||function(t,n){if(t){if("string"==typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}(n,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),o=s[1],a=s[3];if("function"==typeof btoa){var i=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),c="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),u="/*# ".concat(c," */"),l=a.sources.map((function(t){return"/*# sourceURL=".concat(a.sourceRoot||"").concat(t," */")}));return[o].concat(l).concat([u]).join("\n")}return[o].join("\n")}},179:t=>{t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAkUExURf///y6r//H5/zyw/0+4/7zk/9/y/4rQ/6fc/3HG/87r/2C//yI8NCQAAADaSURBVCjPYxDEAhhoJZjhiEVQgdURiyAD10QMwQAGBrZidMECBgYGpm40QSMGEEg3RBGUBAsysE5EcecsiChTC7KgoYcCA5IRYEERtnbPIIioCkKlAgNTeCtYMStCEOymRSBBLoSgGAMMsCMERRRggolIQecKE5yIHJ7CnhWLYEbCBIUXQRRyo4R8AEQwEEXQCuJPQ9Q4amJgTYA4CElQeLdhAoPmbke02BSB60cSFMewHQgk0hIYCjETwwRWLCkkIBmLoJIjpqA0J5YEJtGIRVAUW1I0oWXyBgCD/z+n8HymxAAAAABJRU5ErkJggg=="},225:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>s});const r={mixins:[n(332).Z],data:function(){return{}}},s=(0,n(792).Z)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("eb-page",[n("eb-navbar",{attrs:{large:"",largeTransparent:"",title:t.$text("Contacts Management"),"eb-back-link":"Back"}}),t._v(" "),t.syncStatus?n("f7-list",{attrs:{form:"","inline-labels":"","no-hairlines-md":""}},[n("f7-list-group",[n("f7-list-item",{attrs:{"group-title":"",title:t.$text("Departments")}}),t._v(" "),n("eb-list-item",{attrs:{link:"#","eb-href":"contacts/sync?type=departments",title:t.$text("Sync Remote -> Local")}},[n("div",{staticClass:"after",attrs:{slot:"after"},slot:"after"},[n("f7-badge",[t._v(t._s(t.syncStatus.departments?t.$text("Synchronized"):t.$text("Not Synchronized")))])],1)])],1),t._v(" "),n("f7-list-group",[n("f7-list-item",{attrs:{"group-title":"",title:t.$text("Members")}}),t._v(" "),n("eb-list-item",{attrs:{link:"#","eb-href":"contacts/sync?type=members",title:t.$text("Sync Remote -> Local")}},[n("div",{staticClass:"after",attrs:{slot:"after"},slot:"after"},[n("f7-badge",[t._v(t._s(t.syncStatus.members?t.$text("Synchronized"):t.$text("Not Synchronized")))])],1)])],1)],1):t._e()],1)}),[],!1,null,null,null).exports},867:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>s});const r={mixins:[n(332).Z],data:function(){return{type:this.$f7route.query.type,progressId:null,messagesData:[],ioHelper:null,ioSimple:null,messageClass:{module:"a-dingtalk",messageClassName:"progress"}}},computed:{progressResult:function(){return this.messagesData.map((function(t){return t.content.text})).join("\n")}},created:function(){var t=this;this.$meta.util.performAction({ctx:this,action:{actionModule:"a-socketio",actionComponent:"io",name:"helper"}}).then((function(e){t.ioHelper=e})),this._queueScroll=this.$meta.util.queue(this._queueTaskScroll.bind(this))},beforeDestroy:function(){this._stopSubscribe()},methods:{getPageTitle:function(){var t="departments"===this.type?"Departments":"Members";return"".concat(this.$text(t),": ").concat(this.$text("Sync"))},onSize:function(t){this.$$(this.$refs.textarea).css({height:"".concat(t.height-20,"px"),width:"".concat(t.width-20,"px")})},onPerformSync:function(){var t=this;if(!this.ioSimple)return this.$view.dialog.confirm().then((function(){return t.$api.post("contacts/sync",{type:t.type}).then((function(e){t.progressId=e.progressId,t._startSubscribe()}))}))},_startSubscribe:function(){this.messagesData=[],this._scroll(!0);var t="/a/dingtalk/progress/".concat(this.progressId);this.ioSimple=this.ioHelper.simple({messageClass:this.messageClass}),this.ioSimple.subscribe({path:t,onMessageOffset:this._onMessageOffset.bind(this),onMessageSelect:this._onMessageSelect.bind(this),onMessagePush:this._onMessagePush.bind(this)})},_stopSubscribe:function(){this.ioSimple&&(this.ioSimple.unsubscribe(),this.ioSimple=null)},_onMessageOffset:function(){return this.$api.post("/a/socketio/message/offset",{messageClass:this.messageClass,options:{where:{messageFilter:this.progressId}}})},_onMessageSelect:function(t){var e=t.offset;return this.$api.post("/a/socketio/message/select",{messageClass:this.messageClass,options:{offset:e,where:{messageFilter:this.progressId,messageRead:0}}})},_onMessagePush:function(t){var e=t.messages,n=t.message;this.messagesData=e;var r,s,o=n.content;1===o.done&&this.$meta.eventHub.$emit("dingtalk:contacts:sync",(r={},!0,(s=this.type)in r?Object.defineProperty(r,s,{value:true,enumerable:!0,configurable:!0,writable:!0}):r[s]=true,r)),1!==o.done&&-1!==o.done||this._stopSubscribe(),this._scroll(!1)},_scroll:function(t){var e=this;this.$nextTick((function(){e._queueScroll.push(t)}))},_queueTaskScroll:function(t,e){var n,r=this.$$(this.$refs.textarea);if(t)n=0;else if((n=r[0].scrollHeight-r[0].offsetHeight)<=0)return e();if(r.scrollTop()===n)return e();r.scrollTop(n,300,e)}}},s=(0,n(792).Z)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("eb-page",[n("eb-navbar",{attrs:{title:t.getPageTitle(),"eb-back-link":"Back"}},[n("f7-nav-right",[t.syncStatus&&t.ioHelper?n("eb-link",{attrs:{onPerform:t.onPerformSync}},[t._v(t._s(t.syncStatus[t.type]?t.$text("Sync Again"):t.$text("Sync Now")))]):t._e()],1)],1),t._v(" "),n("eb-box",{on:{size:t.onSize}},[n("textarea",{ref:"textarea",staticClass:"json-textarea json-textarea-margin",attrs:{type:"textarea",readonly:"readonly"},domProps:{value:t.progressResult}})])],1)}),[],!1,null,null,null).exports},792:(t,e,n)=>{"use strict";function r(t,e,n,r,s,o,a,i){var c,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),r&&(u.functional=!0),o&&(u._scopeId="data-v-"+o),a?(c=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),s&&s.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=c):s&&(c=i?function(){s.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:s),c)if(u.functional){u._injectStyles=c;var l=u.render;u.render=function(t,e){return c.call(e),l(t,e)}}else{var f=u.beforeCreate;u.beforeCreate=f?[].concat(f,c):[c]}return{exports:t,options:u}}n.d(e,{Z:()=>r})},824:(t,e,n)=>{var r=n(891);r.__esModule&&(r=r.default),"string"==typeof r&&(r=[[t.id,r,""]]),r.locals&&(t.exports=r.locals),(0,n(159).Z)("272b5b28",r,!0,{})},159:(t,e,n)=>{"use strict";function r(t,e){for(var n=[],r={},s=0;s<e.length;s++){var o=e[s],a=o[0],i={id:t+":"+s,css:o[1],media:o[2],sourceMap:o[3]};r[a]?r[a].parts.push(i):n.push(r[a]={id:a,parts:[i]})}return n}n.d(e,{Z:()=>h});var s="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!s)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var o={},a=s&&(document.head||document.getElementsByTagName("head")[0]),i=null,c=0,u=!1,l=function(){},f=null,d="data-vue-ssr-id",p="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function h(t,e,n,s){u=n,f=s||{};var a=r(t,e);return g(a),function(e){for(var n=[],s=0;s<a.length;s++){var i=a[s];(c=o[i.id]).refs--,n.push(c)}for(e?g(a=r(t,e)):a=[],s=0;s<n.length;s++){var c;if(0===(c=n[s]).refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete o[c.id]}}}}function g(t){for(var e=0;e<t.length;e++){var n=t[e],r=o[n.id];if(r){r.refs++;for(var s=0;s<r.parts.length;s++)r.parts[s](n.parts[s]);for(;s<n.parts.length;s++)r.parts.push(v(n.parts[s]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{var a=[];for(s=0;s<n.parts.length;s++)a.push(v(n.parts[s]));o[n.id]={id:n.id,refs:1,parts:a}}}}function m(){var t=document.createElement("style");return t.type="text/css",a.appendChild(t),t}function v(t){var e,n,r=document.querySelector("style["+d+'~="'+t.id+'"]');if(r){if(u)return l;r.parentNode.removeChild(r)}if(p){var s=c++;r=i||(i=m()),e=S.bind(null,r,s,!1),n=S.bind(null,r,s,!0)}else r=m(),e=x.bind(null,r),n=function(){r.parentNode.removeChild(r)};return e(t),function(r){if(r){if(r.css===t.css&&r.media===t.media&&r.sourceMap===t.sourceMap)return;e(t=r)}else n()}}var b,y=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function S(t,e,n,r){var s=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=y(e,s);else{var o=document.createTextNode(s),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}function x(t,e){var n=e.css,r=e.media,s=e.sourceMap;if(r&&t.setAttribute("media",r),f.ssrId&&t.setAttribute(d,e.id),s&&(n+="\n/*# sourceURL="+s.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(s))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}},142:(t,e,n)=>{var r={"./contacts/management.vue":225,"./contacts/sync.vue":867};function s(t){var e=o(t);return n(e)}function o(t){if(!n.o(r,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return r[t]}s.keys=function(){return Object.keys(r)},s.resolve=o,t.exports=s,s.id=142}},e={};function n(r){var s=e[r];if(void 0!==s)return s.exports;var o=e[r]={id:r,exports:{}};return t[r](o,o.exports,n),o.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var r={};(()=>{"use strict";var t;n.r(r),n.d(r,{default:()=>e}),n(824);const e={install:function(e,r){return t?console.error("already installed."):(t=e,r({routes:n(644).Z,store:n(81).Z(t),config:n(788).Z,locales:n(137).Z,components:n(475).Z}))}}})(),window["a-dingtalk"]=r})();
//# sourceMappingURL=front.js.map