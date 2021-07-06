const _tools = {
  isSuperset(set, subset) {
    for (const elem of subset) {
      if (!set.has(elem)) {
        return false;
      }
    }
    return true;
  },

  union(setA, setB) {
    const _union = new Set(setA);
    for (const elem of setB) {
      _union.add(elem);
    }
    return _union;
  },

  intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  },

  symmetricDifference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB) {
      if (_difference.has(elem)) {
        _difference.delete(elem);
      } else {
        _difference.add(elem);
      }
    }
    return _difference;
  },

  difference(setA, setB) {
    const _difference = new Set(setA);
    for (const elem of setB) {
      _difference.delete(elem);
    }
    return _difference;
  },
};

const _toolNames = ['isSuperset', 'union', 'intersection', 'symmetricDifference', 'difference'];
for (const _toolName of _toolNames) {
  if (!Set.prototype[_toolName]) {
    Object.defineProperty(Set.prototype, _toolName, {
      enumerable: false,
      get() {
        return function (set) {
          return _tools[_toolName](this, set);
        };
      },
    });
  }
}

if (!Set.unique) {
  Object.defineProperty(Set, 'unique', {
    enumerable: false,
    get() {
      return function (array) {
        return Array.from(new Set(array));
      };
    },
  });
}

module.exports = Set;
