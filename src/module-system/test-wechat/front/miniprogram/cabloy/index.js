const Data=require('./data.js');
const Api = require('./api.js');
const Util=require('./util.js');

const cabloy={
  __app: getApp(),
  get app(){
    return this.__app;
  },
  set app(value){
    this.__app=value;
  },
};
cabloy.data=Data(cabloy);
cabloy.api = Api(cabloy);
cabloy.util=Util(cabloy);

module.exports = cabloy;