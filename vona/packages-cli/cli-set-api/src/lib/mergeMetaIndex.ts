import gogocode from 'gogocode';

interface AstNode {
  type: string;
  start: number;
  end: number;
  [key: string]: any;
}

function propertyName(node: AstNode): string | undefined {
  if (node.computed) return;
  if (node.key?.type === 'Identifier') return node.key.name;
  if (node.key?.type === 'StringLiteral') return node.key.value;
}

function literalValue(node: AstNode): string | undefined {
  return node?.type === 'StringLiteral' ? node.value : undefined;
}

function indexObject(source: string): AstNode {
  const file = gogocode(source, {
    parseOptions: { sourceType: 'module', plugins: ['typescript', 'decorators-legacy'] },
  }).node as AstNode;
  const objects: AstNode[] = [];
  for (const statement of file.program.body as AstNode[]) {
    const declaration = statement.declaration ?? statement;
    for (const decorator of declaration.decorators ?? []) {
      const call = decorator.expression;
      if (call.type !== 'CallExpression' || call.callee.name !== 'Meta') continue;
      const options = call.arguments[0];
      if (options?.type !== 'ObjectExpression') continue;
      for (const property of options.properties as AstNode[]) {
        if (property.type === 'ObjectProperty' && propertyName(property) === 'indexes') {
          if (property.value.type !== 'ObjectExpression') {
            throw new Error('meta.index indexes must be an object literal');
          }
          objects.push(property.value);
        }
      }
    }
  }
  if (objects.length !== 1) throw new Error('expected exactly one @Meta indexes object');
  return objects[0];
}

function quote(value: string): string {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

export function mergeMetaIndex(source: string, tableName: string, field: string): string {
  const indexes = indexObject(source);
  const declarations: AstNode[] = [];
  const fields: string[] = [];
  for (const property of indexes.properties as AstNode[]) {
    if (property.type === 'ObjectProperty') {
      const key = propertyName(property);
      if (!key || key === tableName) {
        throw new Error(`unsupported index property for ${tableName}`);
      }
      continue;
    }
    if (property.type !== 'SpreadElement') {
      throw new Error(`unsupported index declaration for ${tableName}`);
    }
    const call = property.argument;
    if (call.type !== 'CallExpression' || call.callee.name !== '$tableColumns') {
      throw new Error(`unsupported index spread for ${tableName}`);
    }
    const name = literalValue(call.arguments[0]);
    if (!name) throw new Error(`index table name must be a string literal: ${tableName}`);
    if (name !== tableName) continue;
    const value = call.arguments[1];
    let values: AstNode[];
    if (value?.type === 'StringLiteral') values = [value];
    else if (value?.type === 'ArrayExpression') values = value.elements;
    else throw new Error(`unsupported index fields for ${tableName}`);
    for (const item of values) {
      const text = literalValue(item);
      if (text === undefined) throw new Error(`unsupported index fields for ${tableName}`);
      for (const spec of text.split(',')) {
        if (!fields.includes(spec)) fields.push(spec);
      }
    }
    declarations.push(property);
  }
  if (!fields.includes(field)) fields.push(field);
  if (declarations.length === 1) {
    const value = declarations[0].argument.arguments[1];
    if (value.type === 'StringLiteral' && fields.length === 1 && value.value === field)
      return source;
    if (value.type === 'ArrayExpression') {
      const values = value.elements.map(literalValue);
      if (
        values.length === fields.length &&
        values.every((item, index) => item === fields[index])
      ) {
        return source;
      }
    }
  }
  const columns = fields.length === 1 ? quote(fields[0]) : `[${fields.map(quote).join(', ')}]`;
  const declaration = `...$tableColumns(${quote(tableName)}, ${columns})`;
  if (!declarations.length) {
    const content = source.slice(indexes.start + 1, indexes.end - 1);
    if (content.trim() && !content.trimEnd().endsWith(',')) {
      throw new Error(`indexes object must use trailing commas before adding ${tableName}`);
    }
    return `${source.slice(0, indexes.start + 1)}\n    ${declaration},${source.slice(indexes.start + 1)}`;
  }
  const patches = declarations.map((item, index) => {
    if (!index) return { start: item.start, end: item.end, text: declaration };
    let end = item.end;
    while (/\s/.test(source[end]) && end < indexes.end) end++;
    if (source[end] === ',') end++;
    return { start: item.start, end, text: '' };
  });
  for (const patch of patches.reverse()) {
    source = `${source.slice(0, patch.start)}${patch.text}${source.slice(patch.end)}`;
  }
  return source;
}
