# Local Metrics Stack

Start the local OpenTelemetry Collector, Prometheus, and Grafana stack:

```bash
docker compose -f observability/docker-compose.metrics.yml up
```

Enable the application metric exporter only for local development:

```text
METRICS_ENABLED=true
METRICS_OTLP_HTTP_URL=http://127.0.0.1:4318/v1/metrics
```

Prometheus scrapes the Collector at its private exporter endpoint. Cabloy deliberately does not expose an application `/metrics` endpoint: Vona workers export independently, and the Collector preserves each worker stream before PromQL aggregates them.

The published ports bind to loopback for development. Production must keep the Collector OTLP receiver and Prometheus exporter on a private workload/monitoring network, inject any OTLP credentials from the deployment secret store, and never proxy those paths through Cloudflare or the public Nginx listener.
