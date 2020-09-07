
const modules = {};
const modulesSync = {};
const modulesMonkey = {};

modules['test-dingtalk'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module/test-dingtalk/front/src/main.js'),
   info: {"pid":"test","name":"dingtalk","fullName":"egg-born-module-test-dingtalk","relativeName":"test-dingtalk","url":"test/dingtalk","sync":false,"monkey":false,"public":false},
};

modules['test-party'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module/test-party/front/src/main.js'),
   info: {"pid":"test","name":"party","fullName":"egg-born-module-test-party","relativeName":"test-party","url":"test/party","sync":false,"monkey":false,"public":false},
};

modules['test-partymonkey'] = {
   instance: require('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module/test-partymonkey-monkey/front/src/main.js'),
   info: {"pid":"test","name":"partymonkey","fullName":"egg-born-module-test-partymonkey","relativeName":"test-partymonkey","url":"test/partymonkey","sync":false,"monkey":true,"public":false},
}

modules['test-wechat'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module/test-wechat/front/src/main.js'),
   info: {"pid":"test","name":"wechat","fullName":"egg-born-module-test-wechat","relativeName":"test-wechat","url":"test/wechat","sync":false,"monkey":false,"public":false},
};

modules['test-wxwork'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module/test-wxwork/front/src/main.js'),
   info: {"pid":"test","name":"wxwork","fullName":"egg-born-module-test-wxwork","relativeName":"test-wxwork","url":"test/wxwork","sync":false,"monkey":false,"public":false},
};

modules['a-authgithub'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-authgithub/front/src/main.js'),
   info: {"pid":"a","name":"authgithub","fullName":"egg-born-module-a-authgithub","relativeName":"a-authgithub","url":"a/authgithub","sync":false,"monkey":false,"public":false},
};

modules['a-authsimple'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-authsimple/front/src/main.js'),
   info: {"pid":"a","name":"authsimple","fullName":"egg-born-module-a-authsimple","relativeName":"a-authsimple","url":"a/authsimple","sync":false,"monkey":false,"public":false},
};

modules['a-authsms'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-authsms/front/src/main.js'),
   info: {"pid":"a","name":"authsms","fullName":"egg-born-module-a-authsms","relativeName":"a-authsms","url":"a/authsms","sync":false,"monkey":false,"public":false},
};

modules['a-base'] = {
   instance: require('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-base-sync/front/src/main.js'),
   info: {"pid":"a","name":"base","fullName":"egg-born-module-a-base","relativeName":"a-base","url":"a/base","sync":true,"monkey":false,"public":false},
}

modules['a-baseadmin'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-baseadmin/front/src/main.js'),
   info: {"pid":"a","name":"baseadmin","fullName":"egg-born-module-a-baseadmin","relativeName":"a-baseadmin","url":"a/baseadmin","sync":false,"monkey":false,"public":false},
};

modules['a-cache'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-cache/front/src/main.js'),
   info: {"pid":"a","name":"cache","fullName":"egg-born-module-a-cache","relativeName":"a-cache","url":"a/cache","sync":false,"monkey":false,"public":false},
};

modules['a-captcha'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-captcha/front/src/main.js'),
   info: {"pid":"a","name":"captcha","fullName":"egg-born-module-a-captcha","relativeName":"a-captcha","url":"a/captcha","sync":false,"monkey":false,"public":false},
};

modules['a-captchasimple'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-captchasimple/front/src/main.js'),
   info: {"pid":"a","name":"captchasimple","fullName":"egg-born-module-a-captchasimple","relativeName":"a-captchasimple","url":"a/captchasimple","sync":false,"monkey":false,"public":false},
};

modules['a-chartjs'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-chartjs/front/src/main.js'),
   info: {"pid":"a","name":"chartjs","fullName":"egg-born-module-a-chartjs","relativeName":"a-chartjs","url":"a/chartjs","sync":false,"monkey":false,"public":false},
};

modules['a-cms'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-cms/front/src/main.js'),
   info: {"pid":"a","name":"cms","fullName":"egg-born-module-a-cms","relativeName":"a-cms","url":"a/cms","sync":false,"monkey":false,"public":false},
};

modules['a-components'] = {
   instance: require('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-components-sync/front/src/main.js'),
   info: {"pid":"a","name":"components","fullName":"egg-born-module-a-components","relativeName":"a-components","url":"a/components","sync":true,"monkey":false,"public":false},
}

modules['a-dashboard'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-dashboard/front/src/main.js'),
   info: {"pid":"a","name":"dashboard","fullName":"egg-born-module-a-dashboard","relativeName":"a-dashboard","url":"a/dashboard","sync":false,"monkey":false,"public":false},
};

modules['a-dingtalk'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-dingtalk/front/src/main.js'),
   info: {"pid":"a","name":"dingtalk","fullName":"egg-born-module-a-dingtalk","relativeName":"a-dingtalk","url":"a/dingtalk","sync":false,"monkey":false,"public":false},
};

modules['a-event'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-event/front/src/main.js'),
   info: {"pid":"a","name":"event","fullName":"egg-born-module-a-event","relativeName":"a-event","url":"a/event","sync":false,"monkey":false,"public":false},
};

modules['a-file'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-file/front/src/main.js'),
   info: {"pid":"a","name":"file","fullName":"egg-born-module-a-file","relativeName":"a-file","url":"a/file","sync":false,"monkey":false,"public":false},
};

modules['a-flow'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-flow/front/src/main.js'),
   info: {"pid":"a","name":"flow","fullName":"egg-born-module-a-flow","relativeName":"a-flow","url":"a/flow","sync":false,"monkey":false,"public":false},
};

modules['a-index'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-index/front/src/main.js'),
   info: {"pid":"a","name":"index","fullName":"egg-born-module-a-index","relativeName":"a-index","url":"a/index","sync":false,"monkey":false,"public":false},
};

modules['a-instance'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-instance/front/src/main.js'),
   info: {"pid":"a","name":"instance","fullName":"egg-born-module-a-instance","relativeName":"a-instance","url":"a/instance","sync":false,"monkey":false,"public":false},
};

modules['a-layoutmobile'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-layoutmobile/front/src/main.js'),
   info: {"pid":"a","name":"layoutmobile","fullName":"egg-born-module-a-layoutmobile","relativeName":"a-layoutmobile","url":"a/layoutmobile","sync":false,"monkey":false,"public":false},
};

modules['a-layoutpc'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-layoutpc/front/src/main.js'),
   info: {"pid":"a","name":"layoutpc","fullName":"egg-born-module-a-layoutpc","relativeName":"a-layoutpc","url":"a/layoutpc","sync":false,"monkey":false,"public":false},
};

modules['a-login'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-login/front/src/main.js'),
   info: {"pid":"a","name":"login","fullName":"egg-born-module-a-login","relativeName":"a-login","url":"a/login","sync":false,"monkey":false,"public":false},
};

modules['a-mail'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-mail/front/src/main.js'),
   info: {"pid":"a","name":"mail","fullName":"egg-born-module-a-mail","relativeName":"a-mail","url":"a/mail","sync":false,"monkey":false,"public":false},
};

modules['a-markdownstyle'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-markdownstyle/front/src/main.js'),
   info: {"pid":"a","name":"markdownstyle","fullName":"egg-born-module-a-markdownstyle","relativeName":"a-markdownstyle","url":"a/markdownstyle","sync":false,"monkey":false,"public":false},
};

modules['a-mavoneditor'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-mavoneditor/front/src/main.js'),
   info: {"pid":"a","name":"mavoneditor","fullName":"egg-born-module-a-mavoneditor","relativeName":"a-mavoneditor","url":"a/mavoneditor","sync":false,"monkey":false,"public":false},
};

modules['a-progress'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-progress/front/src/main.js'),
   info: {"pid":"a","name":"progress","fullName":"egg-born-module-a-progress","relativeName":"a-progress","url":"a/progress","sync":false,"monkey":false,"public":false},
};

modules['a-sequence'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-sequence/front/src/main.js'),
   info: {"pid":"a","name":"sequence","fullName":"egg-born-module-a-sequence","relativeName":"a-sequence","url":"a/sequence","sync":false,"monkey":false,"public":false},
};

modules['a-settings'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-settings/front/src/main.js'),
   info: {"pid":"a","name":"settings","fullName":"egg-born-module-a-settings","relativeName":"a-settings","url":"a/settings","sync":false,"monkey":false,"public":false},
};

modules['a-socketio'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-socketio/front/src/main.js'),
   info: {"pid":"a","name":"socketio","fullName":"egg-born-module-a-socketio","relativeName":"a-socketio","url":"a/socketio","sync":false,"monkey":false,"public":false},
};

modules['a-status'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-status/front/src/main.js'),
   info: {"pid":"a","name":"status","fullName":"egg-born-module-a-status","relativeName":"a-status","url":"a/status","sync":false,"monkey":false,"public":false},
};

modules['a-themehyacinth'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-themehyacinth/front/src/main.js'),
   info: {"pid":"a","name":"themehyacinth","fullName":"egg-born-module-a-themehyacinth","relativeName":"a-themehyacinth","url":"a/themehyacinth","sync":false,"monkey":false,"public":false},
};

modules['a-user'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-user/front/src/main.js'),
   info: {"pid":"a","name":"user","fullName":"egg-born-module-a-user","relativeName":"a-user","url":"a/user","sync":false,"monkey":false,"public":false},
};

modules['a-validation'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-validation/front/src/main.js'),
   info: {"pid":"a","name":"validation","fullName":"egg-born-module-a-validation","relativeName":"a-validation","url":"a/validation","sync":false,"monkey":false,"public":false},
};

modules['a-version'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-version/front/src/main.js'),
   info: {"pid":"a","name":"version","fullName":"egg-born-module-a-version","relativeName":"a-version","url":"a/version","sync":false,"monkey":false,"public":false},
};

modules['a-wechat'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-wechat/front/src/main.js'),
   info: {"pid":"a","name":"wechat","fullName":"egg-born-module-a-wechat","relativeName":"a-wechat","url":"a/wechat","sync":false,"monkey":false,"public":false},
};

modules['a-wxwork'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-wxwork/front/src/main.js'),
   info: {"pid":"a","name":"wxwork","fullName":"egg-born-module-a-wxwork","relativeName":"a-wxwork","url":"a/wxwork","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginarticle'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginarticle/front/src/main.js'),
   info: {"pid":"cms","name":"pluginarticle","fullName":"egg-born-module-cms-pluginarticle","relativeName":"cms-pluginarticle","url":"cms/pluginarticle","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginbacktotop'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginbacktotop/front/src/main.js'),
   info: {"pid":"cms","name":"pluginbacktotop","fullName":"egg-born-module-cms-pluginbacktotop","relativeName":"cms-pluginbacktotop","url":"cms/pluginbacktotop","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginbase'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginbase/front/src/main.js'),
   info: {"pid":"cms","name":"pluginbase","fullName":"egg-born-module-cms-pluginbase","relativeName":"cms-pluginbase","url":"cms/pluginbase","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginblock'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginblock/front/src/main.js'),
   info: {"pid":"cms","name":"pluginblock","fullName":"egg-born-module-cms-pluginblock","relativeName":"cms-pluginblock","url":"cms/pluginblock","sync":false,"monkey":false,"public":false},
};

modules['cms-plugincopyright'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-plugincopyright/front/src/main.js'),
   info: {"pid":"cms","name":"plugincopyright","fullName":"egg-born-module-cms-plugincopyright","relativeName":"cms-plugincopyright","url":"cms/plugincopyright","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginmarkdowngithub'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginmarkdowngithub/front/src/main.js'),
   info: {"pid":"cms","name":"pluginmarkdowngithub","fullName":"egg-born-module-cms-pluginmarkdowngithub","relativeName":"cms-pluginmarkdowngithub","url":"cms/pluginmarkdowngithub","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginrss'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginrss/front/src/main.js'),
   info: {"pid":"cms","name":"pluginrss","fullName":"egg-born-module-cms-pluginrss","relativeName":"cms-pluginrss","url":"cms/pluginrss","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginsidebar'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginsidebar/front/src/main.js'),
   info: {"pid":"cms","name":"pluginsidebar","fullName":"egg-born-module-cms-pluginsidebar","relativeName":"cms-pluginsidebar","url":"cms/pluginsidebar","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginsocialshare'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginsocialshare/front/src/main.js'),
   info: {"pid":"cms","name":"pluginsocialshare","fullName":"egg-born-module-cms-pluginsocialshare","relativeName":"cms-pluginsocialshare","url":"cms/pluginsocialshare","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginsubmit'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginsubmit/front/src/main.js'),
   info: {"pid":"cms","name":"pluginsubmit","fullName":"egg-born-module-cms-pluginsubmit","relativeName":"cms-pluginsubmit","url":"cms/pluginsubmit","sync":false,"monkey":false,"public":false},
};

modules['cms-plugintrack'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-plugintrack/front/src/main.js'),
   info: {"pid":"cms","name":"plugintrack","fullName":"egg-born-module-cms-plugintrack","relativeName":"cms-plugintrack","url":"cms/plugintrack","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginuser'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginuser/front/src/main.js'),
   info: {"pid":"cms","name":"pluginuser","fullName":"egg-born-module-cms-pluginuser","relativeName":"cms-pluginuser","url":"cms/pluginuser","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginwechatsdk'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginwechatsdk/front/src/main.js'),
   info: {"pid":"cms","name":"pluginwechatsdk","fullName":"egg-born-module-cms-pluginwechatsdk","relativeName":"cms-pluginwechatsdk","url":"cms/pluginwechatsdk","sync":false,"monkey":false,"public":false},
};

modules['cms-pluginwechatshare'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-pluginwechatshare/front/src/main.js'),
   info: {"pid":"cms","name":"pluginwechatshare","fullName":"egg-born-module-cms-pluginwechatshare","relativeName":"cms-pluginwechatshare","url":"cms/pluginwechatshare","sync":false,"monkey":false,"public":false},
};

modules['cms-sitecommunity'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-sitecommunity/front/src/main.js'),
   info: {"pid":"cms","name":"sitecommunity","fullName":"egg-born-module-cms-sitecommunity","relativeName":"cms-sitecommunity","url":"cms/sitecommunity","sync":false,"monkey":false,"public":false},
};

modules['cms-themeaws'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-themeaws/front/src/main.js'),
   info: {"pid":"cms","name":"themeaws","fullName":"egg-born-module-cms-themeaws","relativeName":"cms-themeaws","url":"cms/themeaws","sync":false,"monkey":false,"public":false},
};

modules['cms-themeblog'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-themeblog/front/src/main.js'),
   info: {"pid":"cms","name":"themeblog","fullName":"egg-born-module-cms-themeblog","relativeName":"cms-themeblog","url":"cms/themeblog","sync":false,"monkey":false,"public":false},
};

modules['cms-themecommunity'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-themecommunity/front/src/main.js'),
   info: {"pid":"cms","name":"themecommunity","fullName":"egg-born-module-cms-themecommunity","relativeName":"cms-themecommunity","url":"cms/themecommunity","sync":false,"monkey":false,"public":false},
};

modules['cms-themedocs'] = {
   instance: () => import('/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/cms-themedocs/front/src/main.js'),
   info: {"pid":"cms","name":"themedocs","fullName":"egg-born-module-cms-themedocs","relativeName":"cms-themedocs","url":"cms/themedocs","sync":false,"monkey":false,"public":false},
};

modulesSync['a-base'] = true;
modulesSync['a-components'] = true;

modulesMonkey['test-partymonkey'] = true;

export default {
  modules,
  modulesSync,
  modulesMonkey,
};
