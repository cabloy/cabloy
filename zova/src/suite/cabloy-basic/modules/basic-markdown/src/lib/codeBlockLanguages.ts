export const codeBlockLanguages = [
  'bash',
  'css',
  'cpp',
  'csharp',
  'go',
  'html',
  'java',
  'javascript',
  'json',
  'markdown',
  'php',
  'python',
  'rust',
  'shell',
  'sql',
  'typescript',
] as const;

export type CodeBlockLanguage = (typeof codeBlockLanguages)[number];

const codeBlockLanguageAliases: Record<string, CodeBlockLanguage> = {
  js: 'javascript',
  sh: 'shell',
  ts: 'typescript',
};

export function getCodeBlockLanguage(
  language: string | null | undefined,
): CodeBlockLanguage | undefined {
  if (!language) return undefined;
  if ((codeBlockLanguages as readonly string[]).includes(language)) {
    return language as CodeBlockLanguage;
  }
  return codeBlockLanguageAliases[language];
}

export function isCodeBlockLanguage(
  language: string | null | undefined,
): language is CodeBlockLanguage {
  return !!getCodeBlockLanguage(language);
}
