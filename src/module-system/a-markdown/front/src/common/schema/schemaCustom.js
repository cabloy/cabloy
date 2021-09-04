import { schema as baseSchema } from 'prosemirror-markdown';
import { Schema } from 'prosemirror-model';
import { tableNodes } from 'prosemirror-tables';

function patchNodes(baseNodes) {
  // doc
  baseNodes = baseNodes.update('doc', Object.assign({}, baseNodes.get('doc'), { content: '(block|containerblock)+' }));
  // code_block
  baseNodes = baseNodes.update('code_block', Object.assign({}, baseNodes.get('code_block'), { isolating: true }));
  // container
  baseNodes = baseNodes.append({
    container: {
      attrs: { params: { default: '' } },
      content: 'block+',
      // content: 'inline*',
      // group: 'block',
      group: 'containerblock',
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
  // table
  baseNodes = baseNodes.append(
    tableNodes({
      tableGroup: 'block',
      cellContent: 'inline*',
      cellAttributes: {
        textAlign: {
          default: null,
          getFromDOM(dom) {
            return (dom.style && dom.style.textAlign) || null;
          },
          setDOMAttr(value, attrs) {
            if (value) {
              attrs.style = (attrs.style || '') + `text-align: ${value};`;
            }
          },
        },
      },
    })
  );
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
