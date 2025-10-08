import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const sdk = new NodeSDK({
  serviceName: 'mawi-backend',
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // OTLP endpoint, ajustar si usas Jaeger OTLP
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

export default sdk;