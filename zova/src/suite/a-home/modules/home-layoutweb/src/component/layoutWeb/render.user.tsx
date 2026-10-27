import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { resolveImagePreviewUrl } from 'zova-module-basic-image';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    return (
      <ClientOnly>
        <li>
          <details>
            <summary>
              <img
                class="h-6 w-6 rounded-full object-cover"
                alt="avatar"
                src={
                  resolveImagePreviewUrl(
                    this.$passport.user?.avatar,
                    this.sys.config.api.baseURL,
                  ) || this.$scopeBase.config.avatar.empty
                }
              />
              {this.$passport.isAuthenticated
                ? this.$passport.displayName
                : this.scope.locale.NotLoggedIn()}
            </summary>
            <ul class="bg-base-100 rounded-t-none p-2 w-40">
              {this.$passport.isAuthenticated ? (
                <>
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
                    <ZButton
                      onPerform={async event => {
                        closeNearestDetails(event);
                        await this.$passport.logout().mutateAsync();
                      }}
                    >
                      {this.scope.locale.Logout()}
                    </ZButton>
                  </li>
                </>
              ) : (
                <li>
                  <a
                    onClick={event => {
                      this.app.$gotoLogin(true);
                      closeNearestDetails(event);
                    }}
                  >
                    {this.scope.locale.Login()}
                  </a>
                </li>
              )}
            </ul>
          </details>
        </li>
      </ClientOnly>
    );
  }
}
