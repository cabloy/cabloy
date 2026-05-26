import { metadataCustomSnippet } from '@cabloy/cli';

const __regEmits = /interface [^<]*Emits<(.*?)> \{/;

export default metadataCustomSnippet({
  file: ({ argv }) => {
    return argv.controllerFileName;
  },
  language: 'plain',
  async transform({ ast, argv }) {
    if (ast.includes(`${argv.controllerClassName}Props`)) {
      throw new Error('Props exists');
    }
    const matchGeneric = ast.match(__regEmits);
    const hasGeneric = !!matchGeneric;
    const genericT = hasGeneric ? '<T = unknown>' : '';
    // Props
    ast = ast.replace('@Controller', `export interface ${argv.controllerClassName}Props${genericT} {}\n\n@Controller`);
    // $propsDefault
    ast = ast.replace('BeanControllerBase {', 'BeanControllerBase {\n  static $propsDefault = {};\n\n');
    // ok
    return ast;
  },
});
