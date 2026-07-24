import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ModelAddressMine } from 'zova-module-commerce-member';
import { ModelCoupon } from 'zova-module-commerce-promotion';
import { ZPage } from 'zova-module-home-base';

import { ModelCart } from '../../model/cart.js';

export const ControllerPageCheckoutSchemaParams = z.object({
  locale: z.string().optional(),
});
export const ControllerPageCheckoutSchemaQuery = z.object({});

@Controller()
export class ControllerPageCheckout extends BeanControllerPageBase {
  @Use()
  $$modelCart: ModelCart;

  @Use()
  $$modelAddressMine: ModelAddressMine;

  @Use()
  $$modelCoupon: ModelCoupon;

  addressId?: string;
  couponGrantId?: string;
  submitting = false;

  get queryAddresses() {
    if (!this.$ssr.isRuntimeSsrHydrated) return;
    return this.$$modelAddressMine.mine({ pageNo: 1, pageSize: 100 });
  }

  get queryCoupons() {
    if (!this.$ssr.isRuntimeSsrHydrated) return;
    return this.$$modelCoupon.mine();
  }

  async checkout() {
    if (!this.addressId || this.submitting) return;
    this.submitting = true;
    try {
      const result = await this.$$modelCart.checkout().mutateAsync({
        addressId: this.addressId,
        couponGrantId: this.couponGrantId,
        correlationId: `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
      });
      this.$router.push({
        name: 'commerce-trade:payment',
        params: { attemptId: String(result.paymentAttemptId) },
      });
    } finally {
      this.submitting = false;
    }
  }

  protected render() {
    if (!this.$ssr.isRuntimeSsrHydrated) {
      return (
        <ZPage>
          <section class="mx-auto max-w-3xl p-6" aria-busy="true" />
        </ZPage>
      );
    }
    const addresses = this.queryAddresses?.data?.list ?? [];
    const coupons = this.queryCoupons?.data ?? [];
    return (
      <ZPage>
        <section class="mx-auto max-w-3xl p-6">
          <h1 class="text-3xl font-semibold">Checkout</h1>
          <div class="mt-6 space-y-6">
            <fieldset class="space-y-2">
              <legend class="font-semibold">Delivery address</legend>
              {addresses.map(address => (
                <label class="flex cursor-pointer gap-3 rounded border border-base-300 p-3">
                  <input
                    type="radio"
                    name="address"
                    value={String(address.id)}
                    v-model={this.addressId}
                  />
                  <span>
                    {address.recipientName} · {address.addressLine1}, {address.city}
                  </span>
                </label>
              ))}
              {addresses.length === 0 && (
                <p class="text-base-content/70">Add an address before checking out.</p>
              )}
            </fieldset>
            <fieldset class="space-y-2">
              <legend class="font-semibold">Coupon</legend>
              <label class="flex cursor-pointer gap-3 rounded border border-base-300 p-3">
                <input type="radio" name="coupon" value="" v-model={this.couponGrantId} />
                <span>No coupon</span>
              </label>
              {coupons.map(coupon => (
                <label class="flex cursor-pointer gap-3 rounded border border-base-300 p-3">
                  <input
                    type="radio"
                    name="coupon"
                    value={String(coupon.id)}
                    v-model={this.couponGrantId}
                  />
                  <span>
                    {coupon.templateName} · ${(coupon.discountCents / 100).toFixed(2)}
                  </span>
                </label>
              ))}
            </fieldset>
            <button
              class="btn btn-primary"
              disabled={!this.addressId || this.submitting}
              onClick={() => this.checkout()}
            >
              Create order
            </button>
          </div>
        </section>
      </ZPage>
    );
  }
}
