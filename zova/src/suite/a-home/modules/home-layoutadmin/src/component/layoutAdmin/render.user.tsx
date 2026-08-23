import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { resolveImagePreviewUrl } from 'zova-module-basic-image';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    return (
      <li>
        <details>
          <summary>
            <img
              class="h-6 w-6 rounded-full object-cover"
              alt="avatar"
              src={
                resolveImagePreviewUrl(this.$passport.user?.avatar, this.sys.config.api.baseURL) ||
                this.$scopeBase.config.avatar.empty
              }
            />
            {this.$passport.user?.name}
          </summary>
          <ul class="bg-base-100 rounded-t-none p-2 w-32">
            <li>
              <a
                onClick={event => {
                  this.app.$gotoPage('/home/user/account');
                  closeNearestDetails(event);
                }}
              >
                {this.scope.locale['Account Settings']()}
              </a>
            </li>
            <li>
              <a
                onClick={event => {
                  this.$passport.logout().mutate();
                  closeNearestDetails(event);
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
