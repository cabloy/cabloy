import { BeanAopBase } from 'zova';
import { Aop, AopActionRender } from 'zova-module-a-bean';
import { ControllerPageHome } from 'zova-module-home-index';

@Aop({
  match: /home-index\.controller\.pageHome/,
  dependencies: 'demo-basic:home',
})
export class AopHome3 extends BeanAopBase {
  protected render: AopActionRender<ControllerPageHome> = (_args, next, _receiver) => {
    const result = next();
    return <div class="aop-home-3">{result}</div>;
  };
}
