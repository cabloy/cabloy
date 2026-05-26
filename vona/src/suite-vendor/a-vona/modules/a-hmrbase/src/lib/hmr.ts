import { createBeanDecorator } from 'vona';

export function Hmr(): ClassDecorator {
  return createBeanDecorator('hmr');
}
