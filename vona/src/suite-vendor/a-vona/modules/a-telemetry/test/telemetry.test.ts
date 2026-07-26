import { context, SpanKind, TraceFlags, trace } from '@opentelemetry/api';
import {
  AlwaysOffSampler,
  ParentBasedSampler,
  SamplingDecision,
} from '@opentelemetry/sdk-trace-base';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import { formatLoggerCtx } from '../../../../../../packages-vona/vona-core/src/lib/core/logger/utils.ts';
import { config } from '../src/config/config.ts';
import { createIngressTrustChecker } from '../src/lib/ingress.ts';

function createSpan() {
  const calls = {
    attributes: [] as Array<[string, unknown]>,
    exceptions: [] as unknown[],
    statuses: [] as unknown[],
    ended: 0,
  };
  const span = {
    spanContext: () => ({
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      spanId: '00f067aa0ba902b7',
      traceFlags: 1,
    }),
    recordException: (error: unknown) => calls.exceptions.push(error),
    setStatus: (status: unknown) => calls.statuses.push(status),
    setAttribute: (key: string, value: unknown) => calls.attributes.push([key, value]),
    end: () => calls.ended++,
  };
  return { calls, span };
}

describe('telemetry.test.ts', () => {
  it('parses telemetry configuration with safe defaults', () => {
    const defaults = config({ meta: { env: {} }, name: 'test-service' } as never);
    assert.equal(defaults.enabled, false);
    assert.equal(defaults.serviceName, 'test-service');
    assert.equal(defaults.sampling.rootRatio, 0.1);
    assert.equal(defaults.exporter.url, 'http://127.0.0.1:4318/v1/traces');
    assert.deepEqual(defaults.ingress.trustedProxyCidrs, []);
    assert.equal(defaults.ingress.internalHeader, 'x-vona-telemetry-ingress');
    assert.equal(defaults.ingress.internalHeaderValue, 'internal');

    const configured = config({
      meta: {
        env: {
          TELEMETRY_ENABLED: 'true',
          TELEMETRY_SERVICE_NAME: 'telemetry-test',
          TELEMETRY_SAMPLING_ROOT_RATIO: '0.5',
          TELEMETRY_OTLP_HTTP_HEADERS: 'authorization=Bearer%20token,x-tenant=internal',
          TELEMETRY_INGRESS_TRUSTED_PROXY_CIDRS: '10.0.0.0/8, ::1 ,',
          TELEMETRY_INGRESS_INTERNAL_HEADER: 'x-internal-ingress',
          TELEMETRY_INGRESS_INTERNAL_HEADER_VALUE: 'trusted',
        },
      },
      name: 'test-service',
    } as never);
    assert.equal(configured.enabled, true);
    assert.equal(configured.serviceName, 'telemetry-test');
    assert.equal(configured.sampling.rootRatio, 0.5);
    assert.deepEqual(configured.ingress.trustedProxyCidrs, ['10.0.0.0/8', '::1']);
    assert.equal(configured.ingress.internalHeader, 'x-internal-ingress');
    assert.equal(configured.ingress.internalHeaderValue, 'trusted');
    assert.deepEqual(configured.exporter.headers, {
      'authorization': 'Bearer%20token',
      'x-tenant': 'internal',
    });
  });

  it('trusts only classified ingress peers', () => {
    const isTrustedIngress = createIngressTrustChecker({
      trustedProxyCidrs: ['10.0.0.0/8', '::1'],
      internalHeader: 'x-vona-telemetry-ingress',
      internalHeaderValue: 'internal',
    });

    assert.equal(isTrustedIngress('10.2.3.4', 'internal'), true);
    assert.equal(isTrustedIngress('::1', 'internal'), true);
    assert.equal(isTrustedIngress('::ffff:10.2.3.4', 'internal'), true);
    assert.equal(isTrustedIngress('10.2.3.4', 'public'), false);
    assert.equal(isTrustedIngress('198.51.100.9', 'internal'), false);
    assert.equal(isTrustedIngress(undefined, 'internal'), false);
    assert.equal(
      createIngressTrustChecker({
        trustedProxyCidrs: ['not-a-cidr'],
        internalHeader: 'x-vona-telemetry-ingress',
        internalHeaderValue: 'internal',
      })('10.2.3.4', 'internal'),
      false,
    );
  });

  it('applies root sampling when public ingress has no accepted parent', () => {
    const sampler = new ParentBasedSampler({ root: new AlwaysOffSampler() });
    const sampledParent = trace.setSpanContext(context.active(), {
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      spanId: '00f067aa0ba902b7',
      traceFlags: TraceFlags.SAMPLED,
      isRemote: true,
    });

    const trustedDecision = sampler.shouldSample(
      sampledParent,
      '4bf92f3577b34da6a3ce929d0e0e4737',
      'HTTP GET',
      SpanKind.SERVER,
      {},
      [],
    );
    const publicDecision = sampler.shouldSample(
      context.active(),
      '4bf92f3577b34da6a3ce929d0e0e4737',
      'HTTP GET',
      SpanKind.SERVER,
      {},
      [],
    );

    assert.equal(trustedDecision.decision, SamplingDecision.RECORD_AND_SAMPLED);
    assert.equal(publicDecision.decision, SamplingDecision.NOT_RECORD);
  });

  it('does not create spans or carriers when telemetry is disabled', async () => {
    await app.bean.executor.mockCtx(async () => {
      const telemetry = app.scope('a-telemetry').service.telemetry;
      assert.equal(telemetry.enabled, false);
      assert.deepEqual(telemetry.injectCarrier(), { version: 1 });
    });
  });

  it('keeps every global facade method safe while telemetry is disabled', async () => {
    await app.bean.executor.mockCtx(async () => {
      const facade = app.bean.telemetry;
      const service = app.scope('a-telemetry').service.telemetry;
      const originalStartSpan = service.startSpan;
      const originalWithSpan = service.withSpan;
      const originalRecordException = service.recordException;
      let serviceCalls = 0;
      try {
        service.startSpan = (() => serviceCalls++) as never;
        service.withSpan = (() => serviceCalls++) as never;
        service.recordException = (() => serviceCalls++) as never;

        assert.equal(facade.enabled, false);
        const span = facade.startSpan('telemetry.test.disabled');
        assert.equal(span.isRecording(), false);
        assert.doesNotThrow(() => {
          span.setAttribute('vona.operation', 'test');
          span.end();
          facade.recordException(span, new Error('ignored'));
        });
        assert.equal(
          facade.withSpan(span, () => 'result'),
          'result',
        );
        assert.equal(
          facade.withNamedSpan('telemetry.test.disabled', () => 'managed-result'),
          'managed-result',
        );
        assert.equal(serviceCalls, 0);
      } finally {
        service.startSpan = originalStartSpan;
        service.withSpan = originalWithSpan;
        service.recordException = originalRecordException;
      }
    });
  });

  it('manages successful custom spans through the global facade', async () => {
    await app.bean.executor.mockCtx(async () => {
      const service = app.scope('a-telemetry').service.telemetry;
      const { calls, span } = createSpan();
      const originalStartSpan = service.startSpan;
      const originalWithSpan = service.withSpan;
      const originalRecordException = service.recordException;
      const names: string[] = [];
      const options = { attributes: { 'vona.operation': 'test' } };
      try {
        Object.defineProperty(service, 'enabled', { configurable: true, value: true });
        service.startSpan = ((name: string, receivedOptions: unknown) => {
          names.push(name);
          assert.equal(receivedOptions, options);
          return span;
        }) as never;
        service.withSpan = ((_span, fn) => fn()) as never;
        service.recordException = ((...args: unknown[]) => calls.exceptions.push(args)) as never;

        const result = await app.bean.telemetry.withNamedSpan(
          'telemetry.test.success',
          async () => 'result',
          options,
        );

        assert.equal(result, 'result');
        assert.deepEqual(names, ['telemetry.test.success']);
        assert.equal(calls.ended, 1);
        assert.deepEqual(calls.exceptions, []);
      } finally {
        delete (service as any).enabled;
        service.startSpan = originalStartSpan;
        service.withSpan = originalWithSpan;
        service.recordException = originalRecordException;
      }
    });
  });

  it('records and rethrows custom span failures through the global facade', async () => {
    await app.bean.executor.mockCtx(async () => {
      const service = app.scope('a-telemetry').service.telemetry;
      const { calls, span } = createSpan();
      const originalStartSpan = service.startSpan;
      const originalWithSpan = service.withSpan;
      const originalRecordException = service.recordException;
      const error = new Error('boom');
      try {
        Object.defineProperty(service, 'enabled', { configurable: true, value: true });
        service.startSpan = (() => span) as never;
        service.withSpan = ((_span, fn) => fn()) as never;
        service.recordException = ((recordedSpan: unknown, recordedError: unknown) => {
          calls.exceptions.push([recordedSpan, recordedError]);
        }) as never;

        assert.throws(
          () =>
            app.bean.telemetry.withNamedSpan('telemetry.test.failure.sync', () => {
              throw error;
            }),
          caught => caught === error,
        );
        assert.deepEqual(calls.exceptions, [[span, error]]);
        assert.equal(calls.ended, 1);

        calls.exceptions.length = 0;
        calls.ended = 0;
        await assert.rejects(
          app.bean.telemetry.withNamedSpan('telemetry.test.failure.async', async () => {
            throw error;
          }),
          caught => caught === error,
        );
        assert.deepEqual(calls.exceptions, [[span, error]]);
        assert.equal(calls.ended, 1);

        calls.exceptions.length = 0;
        calls.ended = 0;
        service.recordException = (() => {
          throw new Error('telemetry failed');
        }) as never;
        assert.throws(
          () =>
            app.bean.telemetry.withNamedSpan('telemetry.test.cleanup', () => {
              throw error;
            }),
          caught => caught === error,
        );
        assert.equal(calls.ended, 1);

        calls.ended = 0;
        service.recordException = ((recordedSpan: unknown, recordedError: unknown) => {
          calls.exceptions.push([recordedSpan, recordedError]);
        }) as never;
        span.end = () => {
          calls.ended++;
          throw new Error('span end failed');
        };
        assert.throws(
          () =>
            app.bean.telemetry.withNamedSpan('telemetry.test.end-failure', () => {
              throw error;
            }),
          caught => caught === error,
        );
        assert.equal(calls.ended, 1);
      } finally {
        delete (service as any).enabled;
        service.startSpan = originalStartSpan;
        service.withSpan = originalWithSpan;
        service.recordException = originalRecordException;
      }
    });
  });

  it('preserves valid carriers without throwing for malformed input', async () => {
    await app.bean.executor.mockCtx(async () => {
      const telemetry = app.scope('a-telemetry').service.telemetry;
      const carrier = {
        version: 1 as const,
        traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
      };
      assert.doesNotThrow(() => telemetry.extractCarrier(carrier));
      assert.doesNotThrow(() =>
        telemetry.extractCarrier({
          version: 1,
          traceparent: 'invalid',
        }),
      );
    });
  });

  it('records exceptions and completes HTTP spans without request data', async () => {
    await app.bean.executor.mockCtx(async () => {
      const telemetry = app.scope('a-telemetry').service.telemetry;
      const { calls, span } = createSpan();

      telemetry.recordException(span as never, new Error('boom'));
      telemetry.endHttpSpan(span as never, 503);

      assert.equal(calls.exceptions.length, 1);
      assert.deepEqual(calls.statuses, [
        { code: 2, message: 'boom' },
        { code: 2, message: undefined },
      ]);
      assert.deepEqual(calls.attributes, [['http.response.status_code', 503]]);
      assert.equal(calls.ended, 1);
    });
  });

  it('correlates logs in a pathless Vona context with an active span', async () => {
    await app.bean.executor.mockCtx(async () => {
      const { span } = createSpan();
      app.ctx.req.url = '';
      app.ctx.state.telemetry = {
        requestId: 'test-request-id',
        span: span as never,
      };
      const info = formatLoggerCtx().transform(
        { level: 'info', message: 'test' },
        {} as never,
      ) as Record<string, unknown>;
      assert.equal(info.request_id, 'test-request-id');
      assert.equal(info.trace_id, span.spanContext().traceId);
      assert.equal(info.span_id, span.spanContext().spanId);
      assert.equal(info.trace_flags, span.spanContext().traceFlags);
    });
  });
});
