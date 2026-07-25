import IP from '@eggjs/ip';

import type { ITelemetryIngressConfig } from '../config/config.ts';

type AddressMatcher = (address: string) => boolean;

export function createIngressTrustChecker(config: ITelemetryIngressConfig) {
  const trustedProxyMatchers = config.trustedProxyCidrs
    .map(createAddressMatcher)
    .filter((matcher): matcher is AddressMatcher => Boolean(matcher));

  return (peerAddress?: string, internalHeaderValue?: string) => {
    if (internalHeaderValue !== config.internalHeaderValue) return false;
    const address = normalizePeerAddress(peerAddress);
    if (!address) return false;
    return trustedProxyMatchers.some(matcher => matcher(address));
  };
}

function createAddressMatcher(rule: string): AddressMatcher | undefined {
  try {
    if (IP.isV4Format(rule) || IP.isV6Format(rule)) {
      return address => address === rule;
    }
    return IP.cidrSubnet(rule).contains;
  } catch {
    return undefined;
  }
}

function normalizePeerAddress(value?: string) {
  if (!value) return;
  return value.startsWith('::ffff:') ? value.slice('::ffff:'.length) : value;
}
