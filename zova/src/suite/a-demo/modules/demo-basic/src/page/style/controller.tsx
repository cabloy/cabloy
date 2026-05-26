import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $getThemeName } from 'zova-module-a-style';
import { ZPage } from 'zova-module-home-base';

@Controller()
export class ControllerPageStyle extends BeanControllerPageBase {
  active: boolean;
  cTextColor: string;
  cBlock: string;
  renderHello;
  renderHello2;

  protected async __init__() {
    this.cTextColor = this.$computed(() => {
      return this.$style({ color: this.active ? this.$token.color.primary : '' });
    });
    this.cBlock = this.$computed(() => {
      return this.$style({
        padding: '8px',
      });
    });
    this.renderHello = <div class={this.cTextColor}>Hello World</div>;
    this.renderHello2 = this.$computed(() => {
      return <div class={this.cTextColor}>Hello World</div>;
    });
  }

  protected render() {
    return (
      <ZPage>
        <hr></hr>
        <div class={this.cTextColor}>Hello World</div>
        {this.renderHello}
        {this.renderHello2}
        <button
          class="btn btn-primary"
          onClick={() => {
            this.active = !this.active;
          }}
        >
          Switch Active
        </button>
        <hr></hr>
        <div class={this.$cssBase.cTextCenter}>
          <div>$cssBase.cTextCenter</div>
          <button
            class={this.$cssBase.cButtonPrimary}
          >{`$token.color.primary: ${this.$token.color.primary}`}</button>
          <hr></hr>
          <div class={this.cBlock}>
            <div>{`dark: ${String(this.$theme.dark)}`}</div>
            <div>{`dark mode: ${String(this.$theme.darkMode)}`}</div>
            <div>
              <select
                class="select select-bordered w-full max-w-xs"
                onChange={async e => {
                  const target = e.target as HTMLSelectElement;
                  const value = target.value;
                  const darkMode = value === 'auto' ? value : value === 'true';
                  this.$theme.darkMode = darkMode;
                }}
              >
                <option value={false} selected={this.$theme.darkMode === false}>
                  Light
                </option>
                <option value={true} selected={this.$theme.darkMode === true}>
                  Dark
                </option>
                <option value="auto" selected={this.$theme.darkMode === 'auto'}>
                  Auto
                </option>
              </select>
            </div>
            <hr></hr>
            <div style={{ color: this.$token.color.primary }}>
              theme:
              {this.$theme.name}
            </div>
            <div>
              <select
                class="select select-bordered w-full max-w-xs"
                onChange={async e => {
                  const target = e.target as HTMLSelectElement;
                  this.$theme.name = target.value as any;
                }}
              >
                <option
                  value={$getThemeName('home-theme:default')}
                  selected={this.$theme.name === $getThemeName('home-theme:default')}
                >
                  Default
                </option>
                <option
                  value={$getThemeName('home-theme:orange')}
                  selected={this.$theme.name === $getThemeName('home-theme:orange')}
                >
                  Orange
                </option>
              </select>
            </div>
          </div>
        </div>
      </ZPage>
    );
  }
}
