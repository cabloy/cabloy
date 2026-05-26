import { metadataCustomSnippet } from '@cabloy/cli';

import { locale_transform } from '../utils.ts';

const __resources = { Name: '名称', Description: '描述', Operations: '操作' };

export default metadataCustomSnippet({
  file: 'src/config/locale/zh-cn.ts',
  language: 'plain',
  async transform({ ast, argv }) {
    return locale_transform({ ast, argv, resources: __resources });
  },
});
