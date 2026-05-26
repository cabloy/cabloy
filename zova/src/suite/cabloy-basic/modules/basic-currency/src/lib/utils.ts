import type { CurrencyOptions } from '@zhennann/currency';

import { Currency } from '@zhennann/currency';

export function currencyFormat(value: any, options?: CurrencyOptions) {
  if (!value || (typeof value !== 'number' && typeof value !== 'string')) return value;
  const currency = new Currency(options);
  return currency.format(value);
}

export function currencyUpdate(value: any, options?: CurrencyOptions) {
  const currency = new Currency(options);
  return currency.update(value);
}
