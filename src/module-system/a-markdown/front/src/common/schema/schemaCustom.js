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
      parseDOM: [{ tag: 'u' }, { tag: 'ins' }, { style: 'text-decoration=underline' }],
      toDOM() {
        return ['ins', 0];
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
