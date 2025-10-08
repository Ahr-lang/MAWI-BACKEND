import { metrics } from '@opentelemetry/api';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const meterProvider = new MeterProvider({
  readers: [new PrometheusExporter({ port: 9464 })],
});

metrics.setGlobalMeterProvider(meterProvider);

const meter = metrics.getMeter('mawi-backend');

export const requestCounter = meter.createCounter('http_requests_total', {
  description: 'Total number of HTTP requests',
});

export const queueLengthGauge = meter.createObservableGauge('queue_length', {
  description: 'Current queue length',
});

export const cacheHitCounter = meter.createCounter('cache_hits_total', {
  description: 'Total cache hits',
});

export const cacheMissCounter = meter.createCounter('cache_misses_total', {
  description: 'Total cache misses',
});

export default meter;