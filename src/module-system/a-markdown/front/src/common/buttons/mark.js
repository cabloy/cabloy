import { markItem } from './utils.js';

export const ButtonMark = {
  mark: true,
  title: 'EditorButtonTitleMark',
  icon: { material: 'bookmark' },
  onBuild: markItem,
};
