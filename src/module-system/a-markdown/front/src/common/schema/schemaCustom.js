import { schema as baseSchema } from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';

function patchNodes(baseNodes) {
  // code_block
  baseNodes = baseNodes.update('code_block', Object.assign({}, baseNodes.get('code_block'), { isolating: true }));
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
