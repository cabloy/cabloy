import type {
  ApiApiHomeUserAccountchangePasswordRequestBody,
  ApiApiHomeUserAccountcurrentResponseBody,
  ApiApiHomeUserAccountissuePasswordSetLinkRequestBody,
} from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm, ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { resolveImagePreviewUrl, ZImageUploader } from 'zova-module-basic-image';
import { ZPage } from 'zova-module-home-base';

import type { AccountProfileUpdateCommand } from '../../model/account.js';

import { ModelAccount } from '../../model/account.js';

const homeUserAvatarScene = 'home-user:homeUserAvatar';

type AccountCurrent = ApiApiHomeUserAccountcurrentResponseBody;

type ProfileDraft = AccountProfileUpdateCommand;
type PasswordDraft = ApiApiHomeUserAccountchangePasswordRequestBody;
type PasswordSetIssueDraft = Omit<
  ApiApiHomeUserAccountissuePasswordSetLinkRequestBody,
  'consumerUrl'
>;

const emptyPasswordDraft = (): PasswordDraft => ({
  currentPassword: '',
  newPassword: '',
  passwordConfirm: '',
});

@Controller()
export class ControllerPageAccount extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  profileDraft?: ProfileDraft;
  avatarPreview?: string;
  schemaProfileUpdate?: SchemaObject;
  schemaPasswordChange?: SchemaObject;
  passwordDraft: PasswordDraft = emptyPasswordDraft();
  passwordSetIssueDraft: PasswordSetIssueDraft = { email: '' };
  passwordSetLinkSubmitting = false;
  profileMessage?: string;
  profileError?: string;
  passwordSetLinkMessage?: string;
  passwordSetLinkError?: string;

  timezonePlaceholder?: string;

  get apiSchemasProfileUpdate() {
    return this.$apiSchema.homeUserAccount.updateProfile();
  }

  get apiSchemasPasswordChange() {
    return this.$apiSchema.homeUserAccount.changePassword();
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryCurrent);
    await $QueryEnsureLoaded(() => this.apiSchemasProfileUpdate.sdk);
    this.schemaProfileUpdate = this.$computed(() => {
      return this.apiSchemasProfileUpdate.requestBody;
    });
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordChange.sdk);
    this.schemaPasswordChange = this.$computed(() => {
      return this.apiSchemasPasswordChange.requestBody;
    });
    this._resetProfileDraft();
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.timezonePlaceholder = Intl.DateTimeFormat().resolvedOptions().timeZone;
    });
  }

  get queryCurrent() {
    return this.$$modelAccount.current();
  }

  async submitProfile(data: TypeFormOnSubmitData<ProfileDraft>) {
    const current = await this.$$modelAccount.updateProfile().mutateAsync(data.value);
    this._resetProfileDraft(current);
    this.profileMessage = this.scope.locale.AccountProfileSaved();
  }

  handleAvatarUploadError() {
    this.profileMessage = this.scope.locale.AccountAvatarUploadFailed();
  }

  async submitPasswordChange(data: TypeFormOnSubmitData<PasswordDraft>) {
    const result = await this.$$modelAccount.changePassword().mutateAsync(data.value);
    if (result.requiresRelogin) await this.$passport.requireRelogin();
  }

  async issuePasswordSetLink() {
    if (this.passwordSetLinkSubmitting) return;
    this.passwordSetLinkSubmitting = true;
    this.passwordSetLinkMessage = undefined;
    this.passwordSetLinkError = undefined;
    try {
      const consumerUrl = this.$router.getPagePath('/home/user/password-set', undefined, true);
      if (!consumerUrl) throw new Error('password-set consumer route is unavailable');
      await this.$$modelAccount.issuePasswordSetLink().mutateAsync({
        ...this.passwordSetIssueDraft,
        consumerUrl,
      });
      this.passwordSetIssueDraft = { email: '' };
      this.passwordSetLinkMessage = this.scope.locale.AccountPasswordSetLinkSent();
    } catch {
      this.passwordSetLinkError = this.scope.locale.AccountPasswordSetLinkFailed();
    } finally {
      this.passwordSetLinkSubmitting = false;
    }
  }

  private _resetProfileDraft(current = this.queryCurrent?.data) {
    if (!current) return;
    this.profileDraft = {
      name: current.name,
      avatar: current.avatar ?? undefined,
      locale: typeof current.locale === 'string' ? current.locale : undefined,
      tz: current.tz ?? undefined,
    };
    this.avatarPreview = current.avatar || this.$scopeBase.config.avatar.empty;
  }

  protected render() {
    const query = this.queryCurrent;
    const current = query?.data;
    if (!current) {
      return (
        <ZPage>
          <section class="mx-auto max-w-4xl p-6">
            {query?.error && (
              <div role="alert" class="alert alert-error">
                <span>{this.scope.locale.AccountLoadFailed()}</span>
              </div>
            )}
          </section>
        </ZPage>
      );
    }
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl p-6">
          <h1 class="text-3xl font-semibold">{this.scope.locale.AccountSettings()}</h1>
          <div class="mt-6 grid gap-6 lg:grid-cols-2">
            {this._renderProfileCard()}
            {this._renderSecurityCard(current)}
          </div>
          {query?.error && (
            <div role="alert" class="alert alert-error mt-6">
              <span>{this.scope.locale.AccountLoadFailed()}</span>
            </div>
          )}
        </section>
      </ZPage>
    );
  }

  private _renderProfileCard() {
    return this._renderProfileForm();
  }

  private _renderProfileForm() {
    return (
      <ZForm
        class="card border border-base-300 bg-base-100 shadow-sm"
        data={this.profileDraft!}
        schema={this.schemaProfileUpdate}
        onSubmitData={data => this.submitProfile(data)}
        onShowError={async () => {
          this.profileError = this.scope.locale.AccountProfileSaveFailed();
        }}
        slotWrapper={children => {
          return <div class="card-body gap-4">{children}</div>;
        }}
        slotHeader={() => <h2 class="card-title">{this.scope.locale.AccountProfile()}</h2>}
        slotFooter={$$form => {
          return (
            <>
              {this.profileMessage && (
                <p class="text-sm text-base-content/70">{this.profileMessage}</p>
              )}
              {this.profileError && (
                <p role="alert" class="text-sm text-error">
                  {this.profileError}
                </p>
              )}
              <button
                class="btn btn-primary"
                disabled={$$form.formState.isSubmitting}
                type="submit"
              >
                {this.scope.locale.AccountSaveProfile()}
              </button>
            </>
          );
        }}
      >
        <ZFormField
          name="avatar"
          slotDefault={({ propsBucket }, $$formField) => {
            const avatarValue =
              typeof propsBucket.value === 'string' ? propsBucket.value : this.avatarPreview;
            const avatar =
              resolveImagePreviewUrl(avatarValue, this.sys.config.api.baseURL) ||
              this.$scopeBase.config.avatar.empty;
            return (
              <ZImageUploader
                previewUrl={avatar}
                emptyPreviewUrl={this.$scopeBase.config.avatar.empty}
                previewAlt={this.scope.locale.AccountChooseAvatar()}
                imageScene={homeUserAvatarScene}
                chooseText={this.scope.locale.AccountChooseAvatar()}
                clearText={this.scope.locale.AccountClearAvatar()}
                crop={{
                  labels: {
                    title: this.scope.locale.AccountAvatarCropImage(),
                    adjust: this.scope.locale.AccountAvatarAdjustImage(),
                    cancel: this.scope.locale.AccountAvatarCancelCrop(),
                    apply: this.scope.locale.AccountAvatarApplyCrop(),
                  },
                  aspectRatio: 1,
                  shape: 'round',
                }}
                resize={{
                  width: 512,
                  height: 512,
                  fit: 'cover',
                  format: 'jpeg',
                  quality: 90,
                }}
                onUploaded={uploaded => {
                  if (!uploaded.url) {
                    this.handleAvatarUploadError();
                    return;
                  }
                  $$formField.setValue(uploaded.url, propsBucket.disableNotifyChanged);
                  $$formField.handleBlur();
                  this.avatarPreview = uploaded.url;
                  this.profileMessage = this.scope.locale.AccountAvatarReady();
                }}
                onCleared={() => {
                  $$formField.setValue(null, propsBucket.disableNotifyChanged);
                  $$formField.handleBlur();
                  this.avatarPreview = this.$scopeBase.config.avatar.empty;
                }}
                onError={() => this.handleAvatarUploadError()}
              />
            );
          }}
        />
        <ZFormFieldPreset
          name="name"
          render="basic-input:formFieldInput"
          options={{ type: 'text' }}
        />
        <ZFormFieldPreset
          name="locale"
          render="basic-input:formFieldInput"
          options={{ type: 'text', placeholder: 'en-us' }}
        />
        <ZFormFieldPreset
          name="tz"
          render="basic-input:formFieldInput"
          options={{ type: 'text', placeholder: this.timezonePlaceholder }}
        />
      </ZForm>
    );
  }

  private _renderSecurityCard(current: AccountCurrent) {
    return (
      <section class="card border border-base-300 bg-base-100 shadow-sm">
        <div class="card-body gap-4">
          <h2 class="card-title">{this.scope.locale.AccountSecurity()}</h2>
          {current.hasSimpleAuth ? this._renderChangePassword() : this._renderSetPassword(current)}
        </div>
      </section>
    );
  }

  private _renderChangePassword() {
    return (
      <div class="space-y-4">
        <p class="text-sm text-base-content/70">{this.scope.locale.AccountChangePasswordHelp()}</p>
        {this._renderChangePasswordForm()}
      </div>
    );
  }

  private _renderChangePasswordForm() {
    return (
      <ZForm
        data={this.passwordDraft}
        schema={this.schemaPasswordChange}
        onSubmitData={data => this.submitPasswordChange(data)}
        onShowError={async () => {
          await this.$performCommand('basic-commands:alert', {
            type: 'error',
            text: this.scope.locale.AccountPasswordChangeFailed(),
          });
        }}
        slotFooter={$$form => {
          return (
            <button class="btn btn-primary" disabled={$$form.formState.isSubmitting} type="submit">
              {this.scope.locale.AccountChangePassword()}
            </button>
          );
        }}
      ></ZForm>
    );
  }

  private _renderSetPassword(current: AccountCurrent) {
    return (
      <form class="space-y-4" onSubmit={event => event.preventDefault()}>
        <p class="text-sm text-base-content/70">{this.scope.locale.AccountSetPasswordHelp()}</p>
        {current.eligibleEmailMasked && (
          <p class="text-sm text-base-content/70">
            {this.scope.locale.AccountSetPasswordRecipient(current.eligibleEmailMasked)}
          </p>
        )}
        <label class="form-control gap-2">
          <span class="label-text">{this.scope.locale.AccountSetPasswordEmail()}</span>
          <input
            class="input input-bordered w-full"
            type="email"
            required
            autocomplete="email"
            v-model={this.passwordSetIssueDraft.email}
          />
        </label>
        {this.passwordSetLinkMessage && (
          <p class="text-sm text-base-content/70">{this.passwordSetLinkMessage}</p>
        )}
        {this.passwordSetLinkError && (
          <p role="alert" class="text-sm text-error">
            {this.passwordSetLinkError}
          </p>
        )}
        <button
          class="btn btn-primary"
          disabled={this.passwordSetLinkSubmitting}
          type="submit"
          onClick={() => void this.issuePasswordSetLink()}
        >
          {this.scope.locale.AccountSendPasswordSetLink()}
        </button>
      </form>
    );
  }
}
