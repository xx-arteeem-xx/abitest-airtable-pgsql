const pino = require('pino');

const transport = pino.transport({
    targets: [
      {
        target: 'pino-pretty',
      },
    ],
  });

module.exports = pino(
    {
        level: process.env.PINO_LOG_LEVEL || 'info',
        formatters: {
            level: (label) => {
                return { level: label.toUpperCase() };
            },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
);