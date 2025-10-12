import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const tracesEndpoint =
  process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
  (process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`
    : 'http://localhost:4318/v1/traces');

const metricsEndpoint =
  process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ||
  (process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`
    : 'http://localhost:4318/v1/metrics');

const traceExporter = new OTLPTraceExporter({ url: tracesEndpoint });
const metricExporter = new OTLPMetricExporter({ url: metricsEndpoint });

const sdk = new NodeSDK({
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({ exporter: metricExporter }),
  instrumentations: [getNodeAutoInstrumentations()],
});

void sdk.start();

process.on('SIGTERM', async () => {
  try { await sdk.shutdown(); } catch {}
  process.exit(0);
});
