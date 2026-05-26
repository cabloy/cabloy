import { createBeanDecorator } from 'zova';

export function Api(): ClassDecorator {
  return createBeanDecorator('api', 'app');
}

export function ApiMeta(): ClassDecorator {
  return createBeanDecorator('apiMeta', 'app');
}

export function ApiSchema(): ClassDecorator {
  return createBeanDecorator('apiSchema', 'app');
}
