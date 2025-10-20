import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

// Only enable OpenTelemetry if explicitly configured
const isOtelEnabled =
  process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ||
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

let sdk: NodeSDK | null = null;

if (isOtelEnabled) {
  console.log('OpenTelemetry is enabled');

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

  sdk = new NodeSDK({
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({ exporter: metricExporter }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  void sdk.start();
} else {
  console.log('OpenTelemetry is disabled - no OTEL endpoints configured');
}

process.on('SIGTERM', async () => {
  try {
    if (sdk) {
      await sdk.shutdown();
    }
  } catch {}
  process.exit(0);
});
