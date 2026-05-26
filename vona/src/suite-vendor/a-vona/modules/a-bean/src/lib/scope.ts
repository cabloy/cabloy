import { createBeanDecorator } from 'vona';

export function Scope(): ClassDecorator {
  return createBeanDecorator('scope');
}
