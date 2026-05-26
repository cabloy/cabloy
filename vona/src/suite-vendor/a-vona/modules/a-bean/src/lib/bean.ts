import { createBeanDecorator } from 'vona';

export function Bean(): ClassDecorator {
  return createBeanDecorator('bean');
}
