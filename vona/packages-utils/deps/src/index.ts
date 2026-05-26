export interface ISwapDepsItem {
  name: string;
  dependencies?: string | string[];
  dependents?: string | string[];
}

export interface ISwapDepsOptions {
  name?: string;
  dependencies?: ((item: ISwapDepsItem) => string | string[] | undefined) | string;
  dependents?: ((item: ISwapDepsItem) => string | string[] | undefined) | string;
}

export function swapDeps(items: ISwapDepsItem[], options?: ISwapDepsOptions) {
  // _handleDependents
  const depsDynamic = _handleDependents(items, options);

  while (true) {
    if (!_swapDeps(depsDynamic, items, options)) break;
  }
}

function _handleDependents(items: ISwapDepsItem[], options?: ISwapDepsOptions) {
  const keyDependents = options?.dependents || 'dependents';
  const keyName = options?.name || 'name';
  const depsDynamic: Record<string, string[]> = {};
  for (const item of items) {
    const itemName = _getProperty(item, keyName);
    let dependents =
      typeof keyDependents === 'function' ? keyDependents(item) : _getProperty(item, keyDependents);
    if (!dependents) continue;
    if (!Array.isArray(dependents)) {
      dependents = dependents.split(',') as any[];
    }
    for (const dep of dependents) {
      if (!depsDynamic[dep]) depsDynamic[dep] = [];
      if (depsDynamic[dep].findIndex(item => item === itemName) === -1) {
        depsDynamic[dep].push(itemName);
      }
    }
  }
  return depsDynamic;
}

function _swapDeps(
  depsDynamic: Record<string, string[]>,
  items: ISwapDepsItem[],
  options?: ISwapDepsOptions,
) {
  const keyDependencies = options?.dependencies || 'dependencies';
  const keyName = options?.name || 'name';
  let result = false;
  for (const item of items) {
    const name = _getProperty(item, keyName);
    let deps =
      (typeof keyDependencies === 'function'
        ? keyDependencies(item)
        : _getProperty(item, keyDependencies)) || [];
    if (typeof deps === 'string') deps = deps.split(',');
    if (depsDynamic[name]) {
      for (const depDynamic of depsDynamic[name]) {
        if (deps.findIndex(item => item === depDynamic) === -1) {
          deps.push(depDynamic);
        }
      }
    }
    for (const dep of deps) {
      if (_swapDep(items, dep, name, keyName)) result = true;
    }
  }
  return result;
}

function _swapDep(arr: ISwapDepsItem[], a: string, b: string, keyName) {
  const indexA = arr.findIndex(item => _getProperty(item, keyName) === a);
  const indexB = arr.findIndex(item => _getProperty(item, keyName) === b);
  if (indexA === -1 || indexB === -1 || indexA < indexB) return false;
  arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
  return true;
}

function _getProperty(obj, name) {
  if (!obj) return undefined;
  const names = name.split('.');
  // loop
  for (const name of names) {
    if (obj[name] === undefined || obj[name] === null) {
      obj = obj[name];
      break;
    }
    obj = obj[name];
  }
  return obj;
}
