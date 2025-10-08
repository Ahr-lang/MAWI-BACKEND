import log4js from 'log4js';
import { trace } from '@opentelemetry/api';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{ISO8601} [%p] %c - %m',
      },
    },
    file: {
      type: 'fileSync',
      filename: 'logs/app.log',
      layout: {
        type: 'messagePassThrough',
      },
    },
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'info' },
  },
});

const logger = log4js.getLogger();

const originalInfo = logger.info.bind(logger);
const originalError = logger.error.bind(logger);
const originalWarn = logger.warn.bind(logger);

logger.info = (message: any, ...args: any[]) => {
  const span = trace.getActiveSpan();
  const traceId = span ? span.spanContext().traceId : 'no-trace';
  const meta = args[0] || {};
  meta.traceId = traceId;
  originalInfo(message, meta, ...args.slice(1));
};

logger.error = (message: any, ...args: any[]) => {
  const span = trace.getActiveSpan();
  const traceId = span ? span.spanContext().traceId : 'no-trace';
  const meta = args[0] || {};
  meta.traceId = traceId;
  originalError(message, meta, ...args.slice(1));
};

logger.warn = (message: any, ...args: any[]) => {
  const span = trace.getActiveSpan();
  const traceId = span ? span.spanContext().traceId : 'no-trace';
  const meta = args[0] || {};
  meta.traceId = traceId;
  originalWarn(message, meta, ...args.slice(1));
};

export default logger;