import { v } from 'vona-module-a-openapiutils';

const patternFrom = /(.{3}).+(.{4})/;
const patternTo = '$1****$2';

export function maskStudentMobile(mobile: string) {
  return mobile.replace(patternFrom, patternTo);
}

export function studentMobileSerializer() {
  return v.serializerReplace({
    // eslint-disable-next-line
    patternFrom,
    patternTo,
  });
}
