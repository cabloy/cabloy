import type { IModule } from '@cabloy/module-info';

import type { VonaApplication } from '../core/application.ts';

import { ErrorClass } from '../bean/resource/error/errorClass.ts';
import { deepExtend } from '../utils/util.ts';

export default function (app: VonaApplication, modules: Record<string, IModule>) {
  // all errors
  const ebErrors = {};

  // load errors
  loadErrors();

  // patch Error
  patchError();

  function patchError() {
    // error
    app.meta.error = app.bean._newBean(ErrorClass, ebErrors);

    // methods
    ['success', 'fail', 'throw', 'parseFail', 'parseSuccess', 'parseCode'].forEach(key => {
      app[key] = function (...args) {
        return app.meta.error[key](undefined, ...args);
      };
    });
  }

  function loadErrors() {
    for (const key in modules) {
      const module = modules[key];
      const ebError = (ebErrors[module.info.relativeName] = {});

      // module errors
      if (module.resource.errors) deepExtend(ebError, module.resource.errors);
    }
  }
}
