import { markItem } from './utils.js';

export const ButtonSup = {
  mark: true,
  title: 'EditorButtonTitleSup',
  icon: { material: 'superscript' },
  onBuild: markItem,
};

export const ButtonSub = {
  mark: true,
  title: 'EditorButtonTitleSub',
  icon: { material: 'subscript' },
  onBuild: markItem,
};
