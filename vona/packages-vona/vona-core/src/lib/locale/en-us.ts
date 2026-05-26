import { errorsInternal } from '../bean/resource/error/errorInternal.ts';

export default {
  ...errorsInternal,
  ValidationFailedDev: 'controller: %s, method: %s, argument: %d',
};
