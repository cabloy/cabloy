import { Environment } from '@marcbachmann/cel-js';

import { getProperty, hasProperty } from '../utils.ts';

export const celEnvBase = new Environment({
  unlistedVariablesAreDyn: true,
  enableOptionalTypes: true,
  homogeneousAggregateLiterals: false,
});

// array
const params: string[] = [];
for (let i = 0; i < 10; i++) {
  params.push('dyn');
  celEnvBase.registerFunction(`concat(${params.join(',')}):list`, _concat);
}

celEnvBase.registerFunction('join(list):string', list => {
  return _join(list);
});
celEnvBase.registerFunction('join(list,string):string', (list, sep) => {
  return _join(list, sep);
});

// string
celEnvBase.registerFunction('string(null):string', value => {
  return String(value);
});

// operator: +
celEnvBase.registerOperator('string + int', (str, n) => str + String(n));
celEnvBase.registerOperator('int + string', (n, str) => String(n) + str);
celEnvBase.registerOperator('string + double', (str, n) => str + String(n));
celEnvBase.registerOperator('double + string', (n, str) => String(n) + str);
celEnvBase.registerOperator('string + null', (str, _n) => str);
celEnvBase.registerOperator('null + string', (_n, str) => str);

// operator: ==
celEnvBase.registerOperator('string == null', (str, n) => str === n);
celEnvBase.registerOperator('int == null', (num, n) => num === n);
celEnvBase.registerOperator('bool == null', (b, n) => b === n);

// get
celEnvBase.registerFunction('get(map,string):dyn', (obj, name) => {
  return getProperty(obj, name) ?? null;
});
celEnvBase.registerFunction('get(map,string,string):dyn', (obj, name, sep) => {
  return getProperty(obj, name, sep) ?? null;
});
celEnvBase.registerFunction('get(bool,string):dyn', (_obj, _name) => {
  return null;
});
celEnvBase.registerFunction('get(bool,string,string):dyn', (_obj, _name, _sep) => {
  return null;
});
celEnvBase.registerFunction('get(null,string):dyn', (_obj, _name) => {
  return null;
});
celEnvBase.registerFunction('get(null,string,string):dyn', (_obj, _name, _sep) => {
  return null;
});

celEnvBase.registerFunction('exists(null,string):bool', (obj, name) => {
  return hasProperty(obj, name);
});
celEnvBase.registerFunction('exists(map,string):bool', (obj, name) => {
  return hasProperty(obj, name);
});

// stringify/parse
celEnvBase.registerFunction('stringify(dyn):string', dyn => {
  return JSON.stringify(dyn, null, 2);
});
celEnvBase.registerFunction('parse(string):dyn', str => {
  return JSON.parse(str);
});

function _concat(...args: any[]): any[] {
  return [].concat(...args);
}

function _join(list?: [], sep?: string): string {
  if (!list) return '';
  return list.join(sep);
}
