import { RouterLink } from '@cabloy/vue-router';
import { withModifiers } from 'vue';
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
            <span class="h-lh min-w-0 flex-1 truncate lg:w-32 lg:flex-none">
              <ClientOnly
                v-slots={{
                  placeholder: () => '',
                  default: () =>
                    this.$passport.isAuthenticated
                      ? this.$passport.displayName
                      : this.scope.locale.NotLoggedIn(),
                }}
              />
            </span>
          </summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-40">
              {this.$passport.isAuthenticated ? (
                <>
                  <li>
                    <RouterLink
                      to={this.$router.getPagePath('/home/user/account')}
                      nativeOnClick={withModifiers(closeNearestDetails, ['left', 'exact'])}
                    >
                      {this.scope.locale['Account Settings']()}
                    </RouterLink>
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
              ) : (
                <li>
                  <RouterLink
                    to={this.app.$getPagePathLogin(true)}
                    nativeOnClick={withModifiers(closeNearestDetails, ['left', 'exact'])}
                  >
                    {this.scope.locale.Login()}
                  </RouterLink>
                </li>
              )}
            </ul>
          </ClientOnly>
        </details>
      </li>
    );
  }
}
