import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { TypeFormOnSubmitData } from 'zova-module-a-form';

import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import type {
  ApiApiCommerceMemberAddresscreateMineRequestBody,
  ApiApiCommerceMemberAddressmineResponseBody,
} from '../../api/commerceMemberAddress.js';

import { ModelAddressMine } from '../../model/addressMine.js';

export const ControllerPageAddressSchemaParams = z.object({});
export const ControllerPageAddressSchemaQuery = z.object({});

type AddressDraft = ApiApiCommerceMemberAddresscreateMineRequestBody;
type AddressItem = ApiApiCommerceMemberAddressmineResponseBody['list'][number];

const emptyDraft = (): AddressDraft => ({
  recipientName: '',
  phone: '',
  countryCode: '',
  region: '',
  city: '',
  postalCode: '',
  addressLine1: '',
  addressLine2: '',
});

@Controller()
export class ControllerPageAddress extends BeanControllerPageBase {
  @Use()
  $$modelAddressMine: ModelAddressMine;

  editingId?: TableIdentity;
  draft: AddressDraft = emptyDraft();
  schemaAddress?: SchemaObject;

  get apiSchemasAddressCreate() {
    return this.scope.apiSchema.commerceMemberAddress.createMine();
  }

  get apiSchemasAddressUpdate() {
    return this.scope.apiSchema.commerceMemberAddress.updateMine();
  }

  protected async __init__() {
    await Promise.all([
      $QueryEnsureLoaded(() => this.queryAddresses),
      $QueryEnsureLoaded(() => this.apiSchemasAddressCreate.sdk),
      $QueryEnsureLoaded(() => this.apiSchemasAddressUpdate.sdk),
    ]);
    this.schemaAddress = this.$computed(() => {
      return this.editingId === undefined
        ? this.apiSchemasAddressCreate.requestBody
        : this.apiSchemasAddressUpdate.requestBody;
    });
  }

  get queryAddresses() {
    return this.$$modelAddressMine.mine({ pageNo: 1, pageSize: 100 });
  }

  edit(item: AddressItem) {
    this.editingId = item.id;
    this.draft = {
      recipientName: item.recipientName,
      phone: item.phone,
      countryCode: item.countryCode,
      region: item.region,
      city: item.city,
      postalCode: item.postalCode,
      addressLine1: item.addressLine1,
      addressLine2: item.addressLine2 ?? '',
    };
  }

  resetDraft() {
    this.editingId = undefined;
    this.draft = emptyDraft();
  }

  async submit(data: TypeFormOnSubmitData<AddressDraft>) {
    if (this.editingId === undefined) {
      await this.$$modelAddressMine.createMine().mutateAsync(data.value);
    } else {
      await this.$$modelAddressMine.updateMine().mutateAsync({
        id: this.editingId,
        body: data.value,
      });
    }
    this.resetDraft();
  }

  async delete(item: AddressItem) {
    await this.$$modelAddressMine.deleteMine().mutateAsync(item.id);
    if (this.editingId === item.id) this.resetDraft();
  }

  protected render() {
    const query = this.queryAddresses;
    const items = query?.data?.list ?? [];
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl p-6">
          <h1 class="text-3xl font-semibold">{this.scope.locale.Addresses()}</h1>
          <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div class="space-y-3">
              {items.length === 0 && (
                <p class="text-base-content/70">{this.scope.locale.AddressesEmpty()}</p>
              )}
              {items.map(item => (
                <article class="card bg-base-100 border border-base-300 shadow-sm">
                  <div class="card-body">
                    <div class="flex items-start justify-between gap-4">
                      <div>
                        <h2 class="card-title">{item.recipientName}</h2>
                        <p class="text-sm text-base-content/70">{item.phone}</p>
                      </div>
                      <div class="flex gap-2">
                        <button class="btn btn-outline btn-sm" onClick={() => this.edit(item)}>
                          {this.scope.locale.EditAddress()}
                        </button>
                        <button
                          class="btn btn-error btn-outline btn-sm"
                          onClick={() => this.delete(item)}
                        >
                          {this.scope.locale.DeleteAddress()}
                        </button>
                      </div>
                    </div>
                    <p>{item.addressLine1}</p>
                    {item.addressLine2 && <p>{item.addressLine2}</p>}
                    <p>
                      {item.city}, {item.region} {item.postalCode}
                    </p>
                    <p>{item.countryCode}</p>
                  </div>
                </article>
              ))}
            </div>
            <div class="card bg-base-100 border border-base-300 shadow-sm">
              <div class="card-body gap-3">
                <ZForm
                  data={this.draft}
                  schema={this.schemaAddress}
                  onSubmitData={data => this.submit(data)}
                  onShowError={async ({ error }) => {
                    await this.$performCommand('basic-commands:alert', {
                      type: 'error',
                      text: error.message,
                    });
                  }}
                  slotHeader={() => (
                    <h2 class="card-title">
                      {this.editingId === undefined
                        ? this.scope.locale.AddAddress()
                        : this.scope.locale.EditAddress()}
                    </h2>
                  )}
                  slotFooter={$$form => (
                    <div class="flex gap-2">
                      <button
                        class="btn btn-primary"
                        disabled={$$form.formState.isSubmitting}
                        type="submit"
                      >
                        {this.scope.locale.SaveAddress()}
                      </button>
                      {this.editingId !== undefined && (
                        <button
                          class="btn btn-outline"
                          type="button"
                          onClick={() => this.resetDraft()}
                        >
                          {this.scope.locale.CancelAddressEdit()}
                        </button>
                      )}
                    </div>
                  )}
                ></ZForm>
              </div>
            </div>
          </div>
          {query?.error && (
            <div role="alert" class="alert alert-error mt-6">
              <span>{query?.error.message}</span>
            </div>
          )}
        </section>
      </ZPage>
    );
  }
}
