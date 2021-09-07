import { markItem } from './utils.js';

export const ButtonStrikethrough = {
  mark: true,
  title: 'EditorButtonTitleStrikethrough',
  icon: { material: 'format_strikethrough' },
  onBuild: markItem,
};
