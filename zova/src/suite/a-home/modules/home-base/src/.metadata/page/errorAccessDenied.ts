import { createZovaComponentPage } from 'zova';

import { ControllerPageErrorAccessDenied } from '../../page/errorAccessDenied/controller.tsx';

export const ZPageErrorAccessDenied = createZovaComponentPage(
  ControllerPageErrorAccessDenied,
  undefined,
  undefined,
);
