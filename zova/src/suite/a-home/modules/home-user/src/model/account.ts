import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type {
  ApiApiHomeUserAccountchangePasswordRequestBody,
  ApiApiHomeUserAccountchangePasswordResponseBody,
  ApiApiHomeUserAccountconsumeActivationRequestBody,
  ApiApiHomeUserAccountconsumePasswordSetRequestBody,
  ApiApiHomeUserAccountconsumePasswordSetResponseBody,
  ApiApiHomeUserAccountissuePasswordSetLinkRequestBody,
  ApiApiHomeUserAccountconsumePasswordResetRequestBody,
  ApiApiHomeUserAccountconsumePasswordResetResponseBody,
  ApiApiHomeUserAccountcurrentResponseBody,
  ApiApiHomeUserAccountrequestPasswordResetRequestBody,
  ApiApiHomeUserAccountrequestPasswordResetResponseBody,
  ApiApiHomeUserAccountupdateProfileRequestBody,
  ApiApiHomeUserAccountupdateProfileResponseBody,
} from 'zova-module-home-api';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsAccount extends IDecoratorModelOptions {}

export type AccountProfileUpdateCommand = Omit<
  ApiApiHomeUserAccountupdateProfileRequestBody,
  'avatar' | 'locale' | 'tz'
> & {
  avatar?: string | null;
  locale?: string | null;
  tz?: string | null;
};

@Model<IModelOptionsAccount>()
export class ModelAccount extends BeanModelBase {
  current() {
    if (!this.$passport.isAuthenticated) return;
    return this.$useStateData<ApiApiHomeUserAccountcurrentResponseBody>({
      queryKey: ['current'],
      queryFn: async () => {
        return await this.$api.homeUserAccount.current();
      },
    });
  }

  updateProfile() {
    return this.$useMutationData<
      ApiApiHomeUserAccountupdateProfileResponseBody,
      AccountProfileUpdateCommand
    >({
      mutationKey: ['updateProfile'],
      mutationFn: async body => {
        return await this.$api.homeUserAccount.updateProfile(
          body as ApiApiHomeUserAccountupdateProfileRequestBody,
        );
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['current'] });
        await this.$passport.refreshCurrent();
      },
    });
  }

  changePassword() {
    return this.$useMutationData<
      ApiApiHomeUserAccountchangePasswordResponseBody,
      ApiApiHomeUserAccountchangePasswordRequestBody
    >({
      mutationKey: ['changePassword'],
      mutationFn: async body => {
        return await this.$api.homeUserAccount.changePassword(body);
      },
    });
  }

  issuePasswordSetLink() {
    return this.$useMutationData<void, ApiApiHomeUserAccountissuePasswordSetLinkRequestBody>({
      mutationKey: ['issuePasswordSetLink'],
      mutationFn: async body => {
        await this.$api.homeUserAccount.issuePasswordSetLink(body);
      },
    });
  }

  consumeActivation() {
    return this.$useMutationData<void, ApiApiHomeUserAccountconsumeActivationRequestBody>({
      mutationKey: ['consumeActivation'],
      mutationFn: async body => {
        await this.$api.homeUserAccount.consumeActivation(body, { authToken: false });
      },
    });
  }

  consumePasswordSet() {
    return this.$useMutationData<
      ApiApiHomeUserAccountconsumePasswordSetResponseBody,
      ApiApiHomeUserAccountconsumePasswordSetRequestBody
    >({
      mutationKey: ['consumePasswordSet'],
      mutationFn: async body => {
        return await this.$api.homeUserAccount.consumePasswordSet(body, { authToken: false });
      },
    });
  }

  requestPasswordReset() {
    return this.$useMutationData<
      ApiApiHomeUserAccountrequestPasswordResetResponseBody,
      ApiApiHomeUserAccountrequestPasswordResetRequestBody
    >({
      mutationKey: ['requestPasswordReset'],
      mutationFn: async body => {
        return await this.$api.homeUserAccount.requestPasswordReset(body, { authToken: false });
      },
    });
  }

  consumePasswordReset() {
    return this.$useMutationData<
      ApiApiHomeUserAccountconsumePasswordResetResponseBody,
      ApiApiHomeUserAccountconsumePasswordResetRequestBody
    >({
      mutationKey: ['consumePasswordReset'],
      mutationFn: async body => {
        return await this.$api.homeUserAccount.consumePasswordReset(body, { authToken: false });
      },
    });
  }
}
