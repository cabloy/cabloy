import { schema as baseSchema } from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';

const baseNodes = baseSchema.spec.nodes;
const schemaCustom = new Schema({
  nodes: baseNodes.update('code_block', Object.assign({}, baseNodes.get('code_block'), { isolating: true })),
  marks: baseSchema.spec.marks,
});
export { schemaCustom };
