import { v } from 'vona-module-a-openapiutils';

export function SensitiveEmail() {
  return v.serializerReplace({
    // eslint-disable-next-line
    patternFrom: /(\w?)(\w+)(\w)(@\w+\.[a-z]+)/,
    patternTo: '$1****$3$4',
  });
}
