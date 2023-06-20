#! /usr/bin/env bash
################################################################
# How to use
#   $git submodule init
#   $git submodule update 
#   $npm install
################################################################ 
# modules
git submodule add -f git@github.com:zhennann/egg-born-module-a-base-sync src/module/a-base-sync
git submodule add -f git@github.com:zhennann/egg-born-module-a-flownodebooster src/module/a-flownodebooster
git submodule add -f git@github.com:zhennann/egg-born-module-a-flowtask src/module/a-flowtask
git submodule add -f git@github.com:zhennann/egg-born-module-a-layoutpc src/module/a-layoutpc
git submodule add -f git@github.com:zhennann/egg-born-module-a-markdown src/module/a-markdown
git submodule add -f git@github.com:zhennann/egg-born-module-a-socketio src/module/a-socketio
git submodule add -f git@github.com:zhennann/egg-born-module-bz-login src/module/bz-login
git submodule add -f git@github.com:zhennann/egg-born-module-test-flow src/module/test-flow
git submodule add -f git@github.com:zhennann/egg-born-module-test-note src/module/test-note
# suites
git submodule add -f git@github.com:zhennann/egg-born-suite-a-dingtalk src/suite/a-dingtalk
git submodule add -f git@github.com:zhennann/egg-born-suite-a-paypal src/suite/a-paypal
git submodule add -f git@github.com:zhennann/egg-born-suite-a-wechat src/suite/a-wechat
git submodule add -f git@github.com:zhennann/egg-born-suite-a-wxwork src/suite/a-wxwork
git submodule add -f git@github.com:zhennann/egg-born-suite-test-party src/suite/test-party
# extra
git submodule add -f git@github.com:zhennann/egg-born-suite-bz-diancai src/suite/bz-diancai