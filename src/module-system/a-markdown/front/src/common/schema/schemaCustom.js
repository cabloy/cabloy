import { schema as baseSchema } from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';

function patchNodes(baseNodes) {
  // code_block
  baseNodes = baseNodes.update('code_block', Object.assign({}, baseNodes.get('code_block'), { isolating: true }));
  // container
  baseNodes = baseNodes.append({
    container: {
      attrs: { params: { default: '' } },
      content: 'block+',
      group: 'block',
      parseDOM: [
        {
          tag: 'div',
          getAttrs: node => {
            const className = String(node.className);
            if (!className.includes('markdown-it-container')) return false;
            const params = className.split(' ')[1].trim();
            return { params };
          },
        },
      ],
      toDOM(node) {
        return ['div', node.attrs.params ? { class: `markdown-it-container ${node.attrs.params}` } : {}, 0];
      },
    },
  });
  // ok
  return baseNodes;
}

function patchMarks(baseMarks) {
  // underline
  baseMarks = baseMarks.append({
    underline: {
      parseDOM: [
        { tag: 'u' }, //
        { tag: 'ins' },
        {
          style: 'text-decoration',
          consuming: false,
          getAttrs: style => (String(style).includes('underline') ? {} : false),
        },
      ],
      toDOM() {
        return ['ins', 0];
      },
    },
  });
  // strikethrough
  baseMarks = baseMarks.append({
    strikethrough: {
      parseDOM: [
        { tag: 's' }, //
        { tag: 'del' },
        { tag: 'strike' },
        {
          style: 'text-decoration',
          consuming: false,
          getAttrs: style => (String(style).includes('line-through') ? {} : false),
        },
      ],
      toDOM() {
        return ['s', 0];
      },
    },
  });
  // mark
  baseMarks = baseMarks.append({
    mark: {
      parseDOM: [{ tag: 'mark' }],
      toDOM() {
        return ['mark', 0];
      },
    },
  });
  // sup
  baseMarks = baseMarks.append({
    sup: {
      parseDOM: [{ tag: 'sup' }],
      toDOM() {
        return ['sup', 0];
      },
    },
  });
  // sub
  baseMarks = baseMarks.append({
    sub: {
      parseDOM: [{ tag: 'sub' }],
      toDOM() {
        return ['sub', 0];
      },
    },
  });

  // ok
  return baseMarks;
}

const baseNodes = patchNodes(baseSchema.spec.nodes);
const baseMarks = patchMarks(baseSchema.spec.marks);

const schemaCustom = new Schema({
  nodes: baseNodes,
  marks: baseMarks,
});
export { schemaCustom };
