import { metadataCustomSnippet } from '@cabloy/cli';

import { locale_transform } from '../utils.ts';

const __resources = {
  BasicInformation: '基本信息',
  Name: '名称',
  Description: '描述',
  Operations: '操作',
  BulkDelete: '批量删除',
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
      [`${resource}Group`]: `${resource}分组统计`,
      [`${resource}Aggregate`]: `${resource}汇总统计`,
      [`${resource}CreateDescription`]: `创建${resource}。`,
      [`${resource}SelectDescription`]: `查询${resource}列表。`,
      [`${resource}GroupDescription`]: `对${resource}进行分组统计。`,
      [`${resource}AggregateDescription`]: `对${resource}进行汇总统计。`,
      [`${resource}ViewDescription`]: `按 ID 查看${resource}。`,
      [`${resource}UpdateDescription`]: `按 ID 更新${resource}。`,
      [`${resource}DeleteDescription`]: `按 ID 删除${resource}。`,
      [`${resource}DeleteBulkDescription`]: `按 ID 批量删除${resource}。`,
    };
    return locale_transform({ ast, argv, resources });
  },
});
