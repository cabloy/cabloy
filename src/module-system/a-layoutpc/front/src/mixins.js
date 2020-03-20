import sectionBaseFn from './common/sectionBase.js';
import buttonBaseFn from './common/buttonBase.js';

export default function(Vue) {
  return {
    ebLayoutSectionBase: sectionBaseFn(Vue),
    ebLayoutButtonBase: buttonBaseFn(Vue),
  };
}
