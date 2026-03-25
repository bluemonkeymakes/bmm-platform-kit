import * as winston from 'winston';

export function createWinstonConfig(): winston.LoggerOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  const structuredJson = winston.format.printf((info) => {
    const { timestamp, level, message, context, ...meta } = info;
    const entry: Record<string, unknown> = {
      timestamp,
      level,
      module: context || 'App',
      message,
    };
    for (const [key, value] of Object.entries(meta)) {
      if (key !== 'service') entry[key] = value;
    }
    return JSON.stringify(entry);
  });

  const consoleFormat = isProduction
    ? winston.format.combine(winston.format.timestamp(), structuredJson)
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const ctx = context ? `[${context}]` : '';
          return `${timestamp} ${level} ${ctx} ${message}`;
        }),
      );

  return {
    level: isProduction ? 'info' : 'debug',
    transports: [new winston.transports.Console({ format: consoleFormat })],
  };
}
