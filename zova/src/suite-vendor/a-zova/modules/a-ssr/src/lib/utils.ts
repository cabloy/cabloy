import * as devalue from 'devalue';

export function unevalPatch(value: any) {
  return devalue.uneval(value);
  // return devalue.uneval(value, value => {
  //   if (value && typeof value === 'object' && value.toJSON) {
  //     return value.toJSON();
  //   }
  // });
}
