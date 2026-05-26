import { createBeanDecorator } from 'zova';

export function Scope(): ClassDecorator {
  return createBeanDecorator('scope', 'app', false);
}
