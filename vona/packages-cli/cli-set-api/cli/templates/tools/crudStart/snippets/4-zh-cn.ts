import { metadataCustomSnippet } from '@cabloy/cli';

import { locale_transform } from '../utils.ts';

const __resources = {
  BasicInformation: '基本信息',
  Name: '名称',
  Description: '描述',
  Operations: '操作',
};

export default metadataCustomSnippet({
  file: 'src/config/locale/zh-cn.ts',
  language: 'plain',
  async transform({ ast, argv }) {
    const resource = argv.resourceNameCapitalize;
    const resources = {
      ...__resources,
      [`${resource}Controller`]: `${resource}管理`,
      [`${resource}Create`]: `创建${resource}`,
      [`${resource}Select`]: `查询${resource}列表`,
      [`${resource}View`]: `查看${resource}`,
      [`${resource}Update`]: `更新${resource}`,
      [`${resource}Delete`]: `删除${resource}`,
    };
    return locale_transform({ ast, argv, resources });
  },
});
