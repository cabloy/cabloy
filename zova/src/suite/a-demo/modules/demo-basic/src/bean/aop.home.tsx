import type { ControllerPageHome } from 'zova-module-home-index';

import { BeanAopBase, polyfillDispose } from 'zova';
import { Aop, AopActionDispose, AopActionInit, AopActionRender } from 'zova-module-a-bean';

@Aop({ match: 'home-index.controller.pageHome' })
export class AopHome extends BeanAopBase {
  protected __init__: AopActionInit<ControllerPageHome> = async (_args, next, receiver) => {
    await next();
    receiver.message += '!';
    polyfillDispose(receiver);
  };

  protected __dispose__: AopActionDispose<ControllerPageHome> = (_args, next, receiver) => {
    receiver.message = receiver.message.substring(0, receiver.message.length - 1);
    next();
  };

  protected render: AopActionRender<ControllerPageHome> = (_args, next, _receiver) => {
    const result = next();
    return <div class="aop-home">{result}</div>;
  };
}
