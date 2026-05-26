import { createBeanDecorator } from 'vona';

export function Service(): ClassDecorator {
  return createBeanDecorator('service');
}
