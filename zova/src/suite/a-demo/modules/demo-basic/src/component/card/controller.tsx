import { BeanControllerBase, ISlot } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerCardProps {
  header?: string;
  content?: string;
  footer?: string;
  onReset?: (time: Date) => void;
  slotHeader?: ISlot;
  slotFooter?: ISlot;
}

@Controller()
export class ControllerCard extends BeanControllerBase {
  static $propsDefault = {
    header: 'default header',
  };

  protected render() {
    return (
      <div>
        <button
          class="btn btn-primary"
          onClick={() => {
            this.$props.onReset?.(new Date());
          }}
        >
          Reset Time
        </button>
        <div>
          <div style={{ backgroundColor: 'teal' }}>
            <div>
              <div>Slot:</div>
              {this.$props.slotHeader?.()}
            </div>
            <div>{`Prop: ${this.$props.header}`}</div>
          </div>
          <div style={{ backgroundColor: 'orange' }}>
            <div>
              <div>Slot:</div>
              {this.$slotDefault?.()}
            </div>
            <div>{`Prop: ${this.$props.content}`}</div>
          </div>
          <div style={{ backgroundColor: 'green' }}>
            <div>
              <div>Slot</div>
              {this.$props.slotFooter?.()}
            </div>
            <div>{`Prop: ${this.$props.footer}`}</div>
          </div>
        </div>
      </div>
    );
  }
}
