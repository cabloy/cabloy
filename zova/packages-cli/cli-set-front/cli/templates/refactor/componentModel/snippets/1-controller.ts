import { metadataCustomSnippet } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    modelName: string;
    controllerFileName: string;
    controllerClassName: string;
  }
}

const __regProps = /interface Controller[^<]*Props<(.*?)>/;
const __regModelsReplace = /interface [^<]*Models([^{]*) \{/;
const __regPropsDefaultReplace = /static \$propsDefault([^{]*) = \{/;
const __regLocalNameReplace = /protected async __init__/;
const __regLocalNameInitReplace = /protected async __init__([^{]*){/;

export default metadataCustomSnippet({
  file: ({ argv }) => {
    return argv.controllerFileName;
  },
  language: 'plain',
  async transform({ cli, ast, argv }) {
    const modelName = argv.modelName;
    const localName = modelName === 'modelValue' ? modelName : `model${cli.helper.firstCharToUpperCase(modelName)}`;
    const typeName = modelName === 'modelValue' ? 'vModel' : `vModel:${modelName}`;
    // models
    if (!ast.includes(`${argv.controllerClassName}Models`)) {
      const matchGeneric = ast.match(__regProps);
      const hasGeneric = !!matchGeneric;
      const generic = matchGeneric && matchGeneric[1];
      const genericT = hasGeneric ? `<${generic}>` : '';
      ast = ast.replace('@Controller', `export interface ${argv.controllerClassName}Models${genericT} {}\n\n@Controller`);
    }
    // exits
    if (ast.includes(`'${typeName}'`)) {
      throw new Error('Model exists');
    }
    // Model
    ast = ast.replace(__regModelsReplace, $0 => {
      return `${$0}\n  '${typeName}'?: number;`;
    });
    // propsDefault
    ast = ast.replace(__regPropsDefaultReplace, $0 => {
      return `${$0}\n  ${modelName}: 0,`;
    });
    // localName
    ast = ast.replace(__regLocalNameReplace, $0 => {
      return `${localName}: number;\n\n    ${$0}`;
    });
    // init
    ast = ast.replace(__regLocalNameInitReplace, $0 => {
      return `${$0}\n    this.${localName} = this.$useModel('${modelName}');`;
    });
    // ok
    return ast;
  },
});
