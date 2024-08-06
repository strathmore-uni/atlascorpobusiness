// auditLogger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'audit.log' })
  ],
});

const AuditLogger = (req, res, next) => {
  res.on('finish', () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const logData = {
      method,
      url: originalUrl,
      statusCode,
      timestamp: new Date(),
    };
    logger.info('Request completed', logData);
  });

  next();
};

module.exports = AuditLogger;
