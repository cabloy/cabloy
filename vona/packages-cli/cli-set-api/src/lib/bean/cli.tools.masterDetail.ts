import type { IModule, IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

type DetailMode = 'aggregate' | 'standalone';
type MasterDtoScene = 'Create' | 'Update' | 'View';
type LocaleName = 'en-us' | 'zh-cn';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    _module: IModule;
    resourceName: string;
    resourceNameCapitalize: string;
    detailModule: string;
    detailModuleInfo: IModuleInfo;
    _detailModule?: IModule;
    detailResourceName: string;
    detailResourceNameCapitalize: string;
    relationName: string;
    relationNameCapitalize: string;
    fk: string;
    detailMode: DetailMode;
    detailPackageName: string;
    detailModuleCapitalize: string;
    detailDtoBaseName: string;
    detailDtoMutateName: string;
    detailDtoViewName: string;
    detailDtoResItemName: string;
    detailFieldPrivateName: string;
    detailDialogTitleCapitalize: string;
    createdDetailModule?: boolean;
    createdDetailResource?: boolean;
  }
}

export class CliToolsMasterDetail extends BeanCliBase {
  async execute() {
    await super.execute();
    this._prepareArgv();
    await this._ensureDetailModule();
    await this._ensureDetailResourceShape();
    await this._patchDetailModule();
    await this._renderMasterDetailDtos();
    await this._patchMasterModule();
    await this._refreshMetadata();
  }

  private _prepareArgv() {
    const { argv } = this.context;
    argv.detailMode = (argv.detailMode || 'aggregate') as DetailMode;
    if (argv.detailMode !== 'aggregate' && argv.detailMode !== 'standalone') {
      throw new Error(`mode is not valid: ${argv.detailMode}`);
    }
    argv.moduleInfo = this.helper.parseModuleInfo(argv.module);
    const _module = this.helper.findModule(argv.module);
    if (!_module) {
      throw new Error(`module does not exist: ${argv.module}`);
    }
    argv._module = _module;
    argv.resourceNameCapitalize = this.helper.firstCharToUpperCase(argv.resourceName);

    argv.detailModuleInfo = this.helper.parseModuleInfo(argv.detailModule);
    argv._detailModule = this.helper.findModule(argv.detailModule);
    argv.detailResourceNameCapitalize = this.helper.firstCharToUpperCase(argv.detailResourceName);
    argv.relationName = argv.relationName || `${argv.detailResourceName}s`;
    argv.relationNameCapitalize = this.helper.firstCharToUpperCase(argv.relationName);
    argv.fk = argv.fk || `${argv.resourceName}Id`;
    argv.detailPackageName = `vona-module-${argv.detailModuleInfo.relativeName}`;
    argv.detailModuleCapitalize = this.helper.stringToCapitalize(
      argv.detailModuleInfo.relativeName,
      '-',
    );
    argv.detailDtoBaseName = `detail${argv.detailResourceNameCapitalize}Base`;
    argv.detailDtoMutateName = `detail${argv.detailResourceNameCapitalize}Mutate`;
    argv.detailDtoViewName = `detail${argv.detailResourceNameCapitalize}View`;
    argv.detailDtoResItemName = `detail${argv.detailResourceNameCapitalize}ResItem`;
    argv.detailFieldPrivateName = `_${argv.relationName}`;
    argv.detailDialogTitleCapitalize = argv.detailModuleCapitalize;
  }

  private async _ensureDetailModule() {
    const { argv } = this.context;
    if (argv._detailModule) return;
    const args = [':create:module', argv.detailModule, '--nometadata'];
    if (argv._module.suite) {
      args.push(`--suite=${argv._module.suite}`);
    }
    await this.helper.invokeCli(args, { cwd: argv.projectPath });
    argv.createdDetailModule = true;
    argv._detailModule = this.helper.findModule(argv.detailModule);
    if (!argv._detailModule) {
      const root = this._resolveCreatedDetailModuleRoot();
      argv._detailModule = {
        name: argv.detailModuleInfo.relativeName,
        info: argv.detailModuleInfo,
        root,
        pkg: path.join(root, 'package.json'),
        package: await this.helper.loadJSONFile(path.join(root, 'package.json')),
        suite: argv._module.suite,
      } as IModule;
    }
  }

  private async _ensureDetailResourceShape() {
    const { argv } = this.context;
    const files = this._detailPaths();
    const hasStandaloneSurface = this._hasStandaloneDetailSurface();
    const hasCoreDetailFiles = fs.existsSync(files.entity) && fs.existsSync(files.model);

    if (!hasCoreDetailFiles) {
      await this.helper.invokeCli(
        [
          ':tools:crudBasic',
          argv.detailResourceName,
          `--module=${argv.detailModule}`,
          '--nometadata',
        ],
        { cwd: argv.projectPath },
      );
      argv.createdDetailResource = true;
    }

    if (argv.detailMode === 'aggregate') {
      if (hasStandaloneSurface && !argv.createdDetailResource) {
        throw new Error(
          `detail module already has a standalone resource surface: ${argv.detailModule}:${argv.detailResourceName}`,
        );
      }
      if (this._hasStandaloneDetailSurface()) {
        this._removeStandaloneDetailSurface();
      }
      return;
    }

    if (!this._hasStandaloneDetailSurface()) {
      throw new Error(
        `detail module does not have a standalone resource surface: ${argv.detailModule}:${argv.detailResourceName}`,
      );
    }
  }

  private async _patchDetailModule() {
    await this._patchDetailEntity();
    await this._patchDetailMetaVersion();
    await this._patchDetailMetaIndex();
  }

  private async _patchDetailEntity() {
    const { argv } = this.context;
    const fileName = this._detailPaths().entity;
    let content = this._readFile(fileName);
    if (content.includes(`${argv.fk}: TableIdentity;`)) return;
    if (!content.includes("import type { TableIdentity } from 'table-identity';")) {
      content = `import type { TableIdentity } from 'table-identity';\n${content}`;
    }
    const marker = `export class Entity${argv.detailResourceNameCapitalize} extends EntityBase {\n`;
    if (!content.includes(marker)) {
      throw new Error(`detail entity is not in the expected shape: ${fileName}`);
    }
    const fieldCode = `  @Api.field(v.required(), ZovaRender.visible(false))\n  ${argv.fk}: TableIdentity;\n\n`;
    content = content.replace(marker, `${marker}${fieldCode}`);
    await this._saveFile(fileName, content);
  }

  private async _patchDetailMetaVersion() {
    const { argv } = this.context;
    const fileName = this._detailPaths().metaVersion;
    let content = this._readFile(fileName);
    if (content.includes(`entity${argv.detailResourceNameCapitalize}.${argv.fk}`)) return;
    const marker = '        table.basicFields();\n';
    if (!content.includes(marker)) {
      throw new Error(`detail meta.version is not in the expected shape: ${fileName}`);
    }
    const line = `        table.tableIdentity(entity${argv.detailResourceNameCapitalize}.${argv.fk}).comment(entity${argv.detailResourceNameCapitalize}.$comment.${argv.fk});\n`;
    content = content.replace(marker, `${marker}${line}`);
    await this._saveFile(fileName, content);
  }

  private async _patchDetailMetaIndex() {
    const { argv } = this.context;
    const fileName = this._detailPaths().metaIndex;
    let content = this._readFile(fileName);
    if (content.includes(`'${argv.fk}'`)) return;
    const marker = '  indexes: {\n';
    if (!content.includes(marker)) {
      throw new Error(`detail meta.index is not in the expected shape: ${fileName}`);
    }
    const line = `    ...$tableColumns('${this.helper.combineModuleNameAndResource(argv.detailModuleInfo.relativeName, argv.detailResourceName)}', '${argv.fk}'),\n`;
    content = content.replace(marker, `${marker}${line}`);
    await this._saveFile(fileName, content);
  }

  private async _renderMasterDetailDtos() {
    const { argv } = this.context;
    const dtoDir = path.join(argv._module.root, 'src/dto');
    await this.helper.ensureDir(dtoDir);
    for (const [dtoBaseName, templateBaseName] of this._detailDtoTemplates()) {
      await this._renderMasterDetailDtoFile(dtoBaseName, templateBaseName);
    }
  }

  private async _patchMasterModule() {
    await this._patchMasterModel();
    await this._patchMasterService();
    for (const scene of this._masterDtoScenes()) {
      await this._patchMasterDto(scene);
    }
    for (const locale of this._masterLocales()) {
      await this._patchMasterLocale(locale);
    }
  }

  private async _patchMasterModel() {
    const { argv } = this.context;
    const fileName = path.join(argv._module.root, 'src/model', `${argv.resourceName}.ts`);
    let content = this._readFile(fileName);
    if (content.includes(`${argv.relationName}: $relation.hasMany(`)) return;
    if (!content.includes("import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';")) {
      content = this._replaceStrict(
        content,
        "import { BeanModelBase, Model } from 'vona-module-a-orm';",
        "import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';",
        fileName,
      );
    }
    if (content.includes('  relations: {\n')) {
      content = content.replace(
        '  relations: {\n',
        `  relations: {\n    ${argv.relationName}: $relation.hasMany('${argv.detailModuleInfo.relativeName}:${argv.detailResourceName}', '${argv.fk}', {\n      columns: ['id', 'name', 'description'],\n    }),\n`,
      );
    } else {
      const marker = `@Model<IModelOptions${argv.resourceNameCapitalize}>({ entity: Entity${argv.resourceNameCapitalize} })`;
      if (!content.includes(marker)) {
        throw new Error(`master model is not in the expected shape: ${fileName}`);
      }
      content = content.replace(
        marker,
        `@Model<IModelOptions${argv.resourceNameCapitalize}>({\n  entity: Entity${argv.resourceNameCapitalize},\n  relations: {\n    ${argv.relationName}: $relation.hasMany('${argv.detailModuleInfo.relativeName}:${argv.detailResourceName}', '${argv.fk}', {\n      columns: ['id', 'name', 'description'],\n    }),\n  },\n})`,
      );
    }
    await this._saveFile(fileName, content);
  }

  private async _patchMasterService() {
    const { argv } = this.context;
    const fileName = path.join(argv._module.root, 'src/service', `${argv.resourceName}.ts`);
    let content = this._readFile(fileName);
    if (content.includes(`include: { ${argv.relationName}: true }`)) return;
    content = this._replaceStrict(
      content,
      `    return await this.scope.model.${argv.resourceName}.insert(${argv.resourceName});`,
      `    return await this.scope.model.${argv.resourceName}.insert(${argv.resourceName}, { include: { ${argv.relationName}: true } });`,
      fileName,
    );
    content = this._replaceStrict(
      content,
      `    return await this.scope.model.${argv.resourceName}.getById(id);`,
      `    return await this.scope.model.${argv.resourceName}.getById(id, { include: { ${argv.relationName}: true } });`,
      fileName,
    );
    content = this._replaceStrict(
      content,
      `    return await this.scope.model.${argv.resourceName}.updateById(id, ${argv.resourceName});`,
      `    return await this.scope.model.${argv.resourceName}.updateById(id, ${argv.resourceName}, {\n      include: { ${argv.relationName}: true },\n    });`,
      fileName,
    );
    content = this._replaceStrict(
      content,
      `    return await this.scope.model.${argv.resourceName}.deleteById(id);`,
      `    return await this.scope.model.${argv.resourceName}.deleteById(id, { include: { ${argv.relationName}: true } });`,
      fileName,
    );
    await this._saveFile(fileName, content);
  }

  private async _patchMasterDto(scene: MasterDtoScene) {
    const { argv } = this.context;
    const fileName = path.join(argv._module.root, 'src/dto', `${argv.resourceName}${scene}.tsx`);
    let content = this._readFile(fileName);
    const detailDtoResItemCapitalize = this._detailDtoResItemCapitalize();
    const detailDtoClassCapitalize = this._detailDtoClassCapitalize(scene);

    if (content.includes(`${argv.detailFieldPrivateName}?: Dto${detailDtoResItemCapitalize}[];`)) {
      return;
    }

    content = this._patchMasterDtoImports(
      content,
      fileName,
      scene,
      detailDtoClassCapitalize,
      detailDtoResItemCapitalize,
    );
    content = this._patchMasterDtoFields(content, fileName, scene);
    content = this._patchMasterDtoClass(
      content,
      fileName,
      scene,
      detailDtoClassCapitalize,
      detailDtoResItemCapitalize,
    );
    await this._saveFile(fileName, content);
  }

  private async _patchMasterLocale(locale: LocaleName) {
    const { argv } = this.context;
    const fileName = path.join(argv._module.root, 'src/config/locale', `${locale}.ts`);
    let content = this._readFile(fileName);
    const additions = this._masterLocaleAdditions(locale);
    for (const addition of additions) {
      const key = addition.split(':')[0];
      if (content.includes(`${key}:`)) continue;
      content = content.replace('};\n', `  ${addition},\n};\n`);
    }
    await this._saveFile(fileName, content);
  }

  private async _refreshMetadata() {
    const { argv } = this.context;
    for (const moduleName of [argv.detailModule, argv.module]) {
      await this.helper.invokeCli([':tools:metadata', moduleName], {
        cwd: argv.projectPath,
      });
    }
  }

  private async _renderMasterDetailDtoFile(dtoBaseName: string, templateBaseName: string) {
    const { argv } = this.context;
    const targetFile = path.join(argv._module.root, 'src/dto', `${dtoBaseName}.tsx`);
    if (fs.existsSync(targetFile)) return;
    const templateFile = this.template.resolveTemplatePath(
      __ThisSetName__,
      `tools/masterDetail/boilerplate/dto/${templateBaseName}`,
    );
    const templateContent = fs.readFileSync(templateFile).toString('utf8');
    const renderedContent = await this.template.renderContent({ content: templateContent });
    await this._saveFile(targetFile, renderedContent);
  }

  private _patchMasterDtoImports(
    content: string,
    fileName: string,
    scene: MasterDtoScene,
    detailDtoClassCapitalize: string,
    detailDtoResItemCapitalize: string,
  ) {
    const { argv } = this.context;
    if (!content.includes("import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';")) {
      content = this._replaceStrict(
        content,
        "import { $Dto } from 'vona-module-a-orm';",
        "import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';\nimport { $Dto } from 'vona-module-a-orm';",
        fileName,
      );
    }
    if (!content.includes("import { $locale } from '../.metadata/locales.ts';")) {
      content = this._replaceStrict(
        content,
        "import { ZovaRender } from 'zova-rest-cabloy-basic-admin';\n",
        "import { ZovaRender } from 'zova-rest-cabloy-basic-admin';\n\nimport { $locale } from '../.metadata/locales.ts';\n",
        fileName,
      );
    }
    const importMarker = `import { Model${argv.resourceNameCapitalize} } from '../model/${argv.resourceName}.ts';\n`;
    if (!content.includes(`import { Dto${detailDtoClassCapitalize} } from './`)) {
      content = this._replaceStrict(
        content,
        importMarker,
        `${importMarker}import { Dto${detailDtoClassCapitalize} } from './${scene === 'View' ? argv.detailDtoViewName : argv.detailDtoMutateName}.tsx';\nimport { Dto${detailDtoResItemCapitalize} } from './${argv.detailDtoResItemName}.tsx';\n`,
        fileName,
      );
    }
    return content;
  }

  private _patchMasterDtoFields(content: string, fileName: string, scene: MasterDtoScene) {
    const { argv } = this.context;
    const fieldCode = `    ${argv.relationName}: $makeMetadata(\n      v.title($locale('${argv.relationNameCapitalize}')),\n      ZovaRender.order(5),\n      ZovaRender.field('basic-details:formFieldDetails'),\n${scene === 'Create' ? '      v.optional(),\n' : ''}    ),\n`;
    if (content.includes('  fields: {\n')) {
      return content.replace('  fields: {\n', `  fields: {\n${fieldCode}`);
    }
    const decoratorMarker = '  ],\n})';
    if (!content.includes(decoratorMarker)) {
      throw new Error(`master dto decorator is not in the expected shape: ${fileName}`);
    }
    return content.replace(decoratorMarker, `  ],\n  fields: {\n${fieldCode}  },\n})`);
  }

  private _patchMasterDtoClass(
    content: string,
    fileName: string,
    scene: MasterDtoScene,
    detailDtoClassCapitalize: string,
    detailDtoResItemCapitalize: string,
  ) {
    const { argv } = this.context;
    const kind = scene === 'Create' ? 'create' : scene === 'Update' ? 'update' : 'get';
    const classReplaceSource = `export class Dto${argv.resourceNameCapitalize}${scene} extends $Dto.${kind}(() => Model${argv.resourceNameCapitalize}) {}`;
    const classReplaceTarget = `export class Dto${argv.resourceNameCapitalize}${scene} extends $Dto.${kind}(() => Model${argv.resourceNameCapitalize}, {\n  include: { ${argv.relationName}: { dtoClass: Dto${detailDtoClassCapitalize} } },\n}) {\n  @Api.field(ZovaRender.visible(false), v.optional(), v.array(Dto${detailDtoResItemCapitalize}))\n  ${argv.detailFieldPrivateName}?: Dto${detailDtoResItemCapitalize}[];\n}`;
    if (!content.includes(classReplaceSource)) {
      throw new Error(`master dto class is not in the expected generated shape: ${fileName}`);
    }
    return content.replace(classReplaceSource, classReplaceTarget);
  }

  private _detailDtoClassCapitalize(scene: MasterDtoScene) {
    const { argv } = this.context;
    return scene === 'View'
      ? this._capitalize(argv.detailDtoViewName)
      : this._capitalize(argv.detailDtoMutateName);
  }

  private _masterLocaleAdditions(locale: LocaleName) {
    const { argv } = this.context;
    if (locale === 'en-us') {
      return [
        `${argv.relationNameCapitalize}: '${this._titleize(argv.relationName)}'`,
        `Add${argv.detailDialogTitleCapitalize}: 'Add ${this._titleize(argv.detailModuleInfo.relativeName)}'`,
        `Edit${argv.detailDialogTitleCapitalize}: 'Edit ${this._titleize(argv.detailModuleInfo.relativeName)}'`,
        `View${argv.detailDialogTitleCapitalize}: 'View ${this._titleize(argv.detailModuleInfo.relativeName)}'`,
      ];
    }
    return [
      `${argv.relationNameCapitalize}: '明细'`,
      `Add${argv.detailDialogTitleCapitalize}: '添加明细'`,
      `Edit${argv.detailDialogTitleCapitalize}: '编辑明细'`,
      `View${argv.detailDialogTitleCapitalize}: '查看明细'`,
    ];
  }

  private _detailPaths() {
    const { argv } = this.context;
    const detailRoot = argv._detailModule!.root;
    return {
      root: detailRoot,
      entity: path.join(detailRoot, 'src/entity', `${argv.detailResourceName}.tsx`),
      model: path.join(detailRoot, 'src/model', `${argv.detailResourceName}.ts`),
      controller: path.join(detailRoot, 'src/controller', `${argv.detailResourceName}.ts`),
      service: path.join(detailRoot, 'src/service', `${argv.detailResourceName}.ts`),
      dtoDir: path.join(detailRoot, 'src/dto'),
      test: path.join(detailRoot, 'test', `${argv.detailResourceName}.test.ts`),
      metaVersion: path.join(detailRoot, 'src/bean', 'meta.version.ts'),
      metaIndex: path.join(detailRoot, 'src/bean', 'meta.index.ts'),
    };
  }

  private _hasStandaloneDetailSurface() {
    const files = this._detailPaths();
    return (
      fs.existsSync(files.controller) || fs.existsSync(files.service) || fs.existsSync(files.dtoDir)
    );
  }

  private _removeStandaloneDetailSurface() {
    const files = this._detailPaths();
    for (const file of [files.controller, files.service, files.test]) {
      if (fs.existsSync(file)) {
        fs.rmSync(file, { force: true });
      }
    }
    if (fs.existsSync(files.dtoDir)) {
      fs.rmSync(files.dtoDir, { recursive: true, force: true });
    }
  }

  private _detailDtoResItemCapitalize() {
    return this._capitalize(this.context.argv.detailDtoResItemName);
  }

  private _detailDtoTemplates() {
    const { argv } = this.context;
    return [
      [argv.detailDtoBaseName, '<%=argv.detailDtoBaseName%>.tsx_'],
      [argv.detailDtoMutateName, '<%=argv.detailDtoMutateName%>.tsx_'],
      [argv.detailDtoViewName, '<%=argv.detailDtoViewName%>.tsx_'],
      [argv.detailDtoResItemName, '<%=argv.detailDtoResItemName%>.tsx_'],
    ] as const;
  }

  private _masterDtoScenes() {
    return ['Create', 'Update', 'View'] as const satisfies readonly MasterDtoScene[];
  }

  private _masterLocales() {
    return ['en-us', 'zh-cn'] as const satisfies readonly LocaleName[];
  }

  private _resolveCreatedDetailModuleRoot() {
    const { argv } = this.context;
    if (argv._module.suite) {
      return path.join(
        argv.projectPath,
        'src/suite',
        argv._module.suite,
        'modules',
        argv.detailModule,
      );
    }
    return path.join(argv.projectPath, 'src/module', argv.detailModule);
  }

  private _capitalize(name: string) {
    return this.helper.firstCharToUpperCase(name);
  }

  private _titleize(name: string) {
    return this.helper
      .stringToCapitalize(name, '-')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }

  private _readFile(fileName: string) {
    if (!fs.existsSync(fileName)) {
      throw new Error(`file does not exist: ${fileName}`);
    }
    return fs.readFileSync(fileName).toString('utf8');
  }

  private async _saveFile(fileName: string, content: string) {
    fs.writeFileSync(fileName, content);
    await this.helper.formatFile({ fileName, logPrefix: 'format: ' });
  }

  private _replaceStrict(content: string, search: string, replacement: string, fileName: string) {
    if (!content.includes(search)) {
      throw new Error(`file is not in the expected shape: ${fileName}`);
    }
    return content.replace(search, replacement);
  }
}
