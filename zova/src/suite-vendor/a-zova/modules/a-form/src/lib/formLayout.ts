import type {
  IFormLayout,
  IFormLayoutField,
  IFormLayoutLeaf,
  IFormLayoutNode,
  IFormLayoutTab,
  IFormLayoutTabs,
  ISchemaObjectExtensionField,
} from 'zova-module-a-openapi';

import type {
  IFormLayoutDiagnostic,
  IResolvedFormLayout,
  IResolvedFormLayoutField,
  IResolvedFormLayoutLeaf,
  IResolvedFormLayoutGroup,
  IResolvedFormLayoutNode,
  IResolvedFormLayoutSection,
  IResolvedFormLayoutTab,
  IResolvedFormLayoutTabs,
} from '../types/formLayout.js';

export function resolveFormLayout(
  layout: IFormLayout,
  properties: ISchemaObjectExtensionField[] | undefined,
): IResolvedFormLayout {
  const propertyNames = new Set(
    properties
      ?.filter(item => item.rest?.visible !== false)
      .map(item => item.key)
      .filter(Boolean) as string[],
  );
  const fieldNames = new Set<string>();
  const nodeIds = new Set<string>();
  const diagnostics: IFormLayoutDiagnostic[] = [];
  const fieldTabPaths: IResolvedFormLayout['fieldTabPaths'] = {};
  const children = layout.children
    .map((node, index) =>
      resolveNode(
        node,
        [index],
        [],
        propertyNames,
        fieldNames,
        nodeIds,
        diagnostics,
        fieldTabPaths,
      ),
    )
    .filter(Boolean) as IResolvedFormLayoutNode[];
  for (const property of properties ?? []) {
    const name = property.key;
    if (!name || !propertyNames.has(name) || fieldNames.has(name)) continue;
    fieldNames.add(name);
    children.push({ type: 'field', name });
  }
  return { children, fieldTabPaths, diagnostics };
}

function resolveNode(
  node: IFormLayoutNode,
  indexPath: number[],
  tabPath: IResolvedFormLayout['fieldTabPaths'][string],
  propertyNames: Set<string>,
  fieldNames: Set<string>,
  nodeIds: Set<string>,
  diagnostics: IFormLayoutDiagnostic[],
  fieldTabPaths: IResolvedFormLayout['fieldTabPaths'],
): IResolvedFormLayoutNode | undefined {
  if (node.type === 'field') {
    return resolveField(node, tabPath, propertyNames, fieldNames, diagnostics, fieldTabPaths);
  }
  if (node.type === 'block') {
    return node;
  }
  if (node.type === 'tabs') {
    return resolveTabs(
      node,
      indexPath,
      propertyNames,
      fieldNames,
      nodeIds,
      diagnostics,
      fieldTabPaths,
    );
  }
  const id = resolveId(node, indexPath);
  if (!registerId(id, nodeIds, diagnostics)) return;
  if (node.type === 'section') {
    const children = node.children
      .map(item =>
        resolveLeaf(item, tabPath, propertyNames, fieldNames, diagnostics, fieldTabPaths),
      )
      .filter(Boolean) as IResolvedFormLayoutLeaf[];
    return children.length ? { ...node, id, children } : undefined;
  }
  const children = node.children
    .map((item, index) =>
      resolveNode(
        item,
        [...indexPath, index],
        tabPath,
        propertyNames,
        fieldNames,
        nodeIds,
        diagnostics,
        fieldTabPaths,
      ),
    )
    .filter(Boolean) as Array<
    IResolvedFormLayoutLeaf | IResolvedFormLayoutGroup | IResolvedFormLayoutSection
  >;
  return children.length ? { ...node, id, children } : undefined;
}

function resolveLeaf(
  node: IFormLayoutLeaf,
  tabPath: IResolvedFormLayout['fieldTabPaths'][string],
  propertyNames: Set<string>,
  fieldNames: Set<string>,
  diagnostics: IFormLayoutDiagnostic[],
  fieldTabPaths: IResolvedFormLayout['fieldTabPaths'],
): IResolvedFormLayoutLeaf | undefined {
  if (node.type === 'block') return node;
  return resolveField(node, tabPath, propertyNames, fieldNames, diagnostics, fieldTabPaths);
}

function resolveTabs(
  node: IFormLayoutTabs,
  indexPath: number[],
  propertyNames: Set<string>,
  fieldNames: Set<string>,
  nodeIds: Set<string>,
  diagnostics: IFormLayoutDiagnostic[],
  fieldTabPaths: IResolvedFormLayout['fieldTabPaths'],
): IResolvedFormLayoutTabs | undefined {
  const id = resolveId(node, indexPath);
  if (!registerId(id, nodeIds, diagnostics)) return;
  const children = node.children
    .map((tab, index) =>
      resolveTab(
        tab,
        [...indexPath, index],
        id,
        propertyNames,
        fieldNames,
        nodeIds,
        diagnostics,
        fieldTabPaths,
      ),
    )
    .filter(Boolean) as IResolvedFormLayoutTab[];
  return children.length ? { ...node, id, children } : undefined;
}

function resolveTab(
  node: IFormLayoutTab,
  indexPath: number[],
  tabsId: string,
  propertyNames: Set<string>,
  fieldNames: Set<string>,
  nodeIds: Set<string>,
  diagnostics: IFormLayoutDiagnostic[],
  fieldTabPaths: IResolvedFormLayout['fieldTabPaths'],
): IResolvedFormLayoutTab | undefined {
  const id = resolveId(node, indexPath);
  if (!registerId(id, nodeIds, diagnostics)) return;
  const tabPath = [{ tabsId, tabId: id }];
  const children = node.children
    .map((item, index) =>
      resolveNode(
        item,
        [...indexPath, index],
        tabPath,
        propertyNames,
        fieldNames,
        nodeIds,
        diagnostics,
        fieldTabPaths,
      ),
    )
    .filter(Boolean) as Array<
    IResolvedFormLayoutLeaf | IResolvedFormLayoutGroup | IResolvedFormLayoutSection
  >;
  return children.length ? { ...node, id, children } : undefined;
}

function resolveField(
  node: IFormLayoutField,
  tabPath: IResolvedFormLayout['fieldTabPaths'][string],
  propertyNames: Set<string>,
  fieldNames: Set<string>,
  diagnostics: IFormLayoutDiagnostic[],
  fieldTabPaths: IResolvedFormLayout['fieldTabPaths'],
): IResolvedFormLayoutField | undefined {
  const name = resolveFieldName(node.name, propertyNames);
  if (!name) {
    diagnostics.push({ type: 'unknownField', value: node.name });
    return;
  }
  if (fieldNames.has(name)) {
    diagnostics.push({ type: 'duplicateField', value: node.name });
    return;
  }
  fieldNames.add(name);
  fieldTabPaths[name] = tabPath;
  return name === node.name ? node : { ...node, name };
}

function resolveFieldName(name: string, propertyNames: Set<string>) {
  if (propertyNames.has(name)) return name;
  const fieldSourcePrefix = `${name}.`;
  const fieldSources = [...propertyNames].filter(item => item.startsWith(fieldSourcePrefix));
  return fieldSources.length === 1 ? fieldSources[0] : undefined;
}

function resolveId(node: { type: string; id?: string }, indexPath: number[]) {
  return node.id || `${node.type}-${indexPath.join('-')}`;
}

function registerId(id: string, ids: Set<string>, diagnostics: IFormLayoutDiagnostic[]) {
  if (!ids.has(id)) {
    ids.add(id);
    return true;
  }
  diagnostics.push({ type: 'duplicateId', value: id });
  return false;
}
