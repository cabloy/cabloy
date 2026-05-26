import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    return (
      <li>
        <details>
          <summary>
            {this.$passport.user?.name}
            {$icon(this.$passport.user?.avatar as any, 24)}
          </summary>
          <ul class="bg-base-100 rounded-t-none p-2 w-32">
            <li>
              <a
                onClick={() => {
                  this.$passport.logout().mutate();
                }}
              >
                {this.scope.locale.Logout()}
              </a>
            </li>
          </ul>
        </details>
      </li>
    );
  }
}
