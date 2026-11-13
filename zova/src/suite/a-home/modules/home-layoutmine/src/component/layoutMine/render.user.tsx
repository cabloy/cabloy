import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { resolveImagePreviewUrl } from 'zova-module-basic-image';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderUser extends BeanRenderBase {
  public render() {
    return (
      <li class="min-w-0">
        <details>
          <summary aria-label={this.scope.locale.Account()} title={this.scope.locale.Account()}>
            <ClientOnly
              v-slots={{
                placeholder: () => (
                  <img
                    class="h-6 w-6 shrink-0 rounded-full object-cover"
                    alt=""
                    src={this.$scopeBase.config.avatar.empty}
                  />
                ),
                default: () => (
                  <img
                    class="h-6 w-6 shrink-0 rounded-full object-cover"
                    alt=""
                    src={
                      resolveImagePreviewUrl(
                        this.$passport.user?.avatar,
                        this.sys.config.api.baseURL,
                      ) || this.$scopeBase.config.avatar.empty
                    }
                  />
                ),
              }}
            />
            <span class="h-lh w-32 min-w-0 truncate">
              <ClientOnly
                v-slots={{ placeholder: () => '', default: () => this.$passport.displayName }}
              />
            </span>
          </summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-40">
              {this.$passport.isAuthenticated && (
                <>
                  <li>
                    <a
                      href={this.$router.getPagePath('/home/user/account')}
                      onClick={event => {
                        if (
                          event.button !== 0 ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          return;
                        }
                        event.preventDefault();
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
                        closeNearestDetails({ currentTarget: event.target });
                        await this.$passport.logout().mutateAsync();
                      }}
                    >
                      {this.scope.locale.Logout()}
                    </ZButton>
                  </li>
                </>
              )}
            </ul>
          </ClientOnly>
        </details>
      </li>
    );
  }
}
