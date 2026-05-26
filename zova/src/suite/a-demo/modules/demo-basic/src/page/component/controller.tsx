import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ZCard, type ControllerCard } from '../../.metadata/index.jsx';

@Controller()
export class ControllerPageComponent extends BeanControllerPageBase {
  resetTime: Date = new Date();
  cardRef?: ControllerCard;

  protected render() {
    return (
      <ZPage>
        <ZCard
          controllerRef={ref => {
            this.cardRef = ref;
            // eslint-disable-next-line
            console.log('cardRef.$props: ', this.cardRef?.$props);
          }}
          header="header"
          content={this.resetTime.toString()}
          footer="footer"
          onReset={time => {
            this.resetTime = time;
          }}
          slotHeader={() => {
            return <div>this is a header slot from parent</div>;
          }}
          slotFooter={() => {
            return <div>this is a footer slot from parent</div>;
          }}
        >
          <div>this is a default slot from parent</div>
        </ZCard>
        <label>Input: </label>
        <input
          bs-behaviors-focus
          type="text"
          class="input w-full max-w-xs"
          value={this.resetTime.toString()}
          ref={ref => {
            // eslint-disable-next-line
            console.log('outer:', ref);
          }}
        ></input>
      </ZPage>
    );
  }
}
