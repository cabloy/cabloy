export const _configDefault = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  bracketSpacing: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  quoteProps: 'consistent',
  sortImports: {
    groups: [
      'type-import',
      ['value-builtin', 'value-external'],
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
  sortPackageJson: true,
  overrides: [
    {
      files: ['*.json'],
      options: {
        printWidth: 80,
        trailingComma: 'none',
      },
    },
  ],
};

export function oxcFormatConfig(configCustom) {
  return Object.assign({}, _configDefault, configCustom);
}
