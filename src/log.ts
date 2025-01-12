import winston from "winston";
import Transport from 'winston-transport';

const logger = winston.createLogger({
  transports: [
    new Transport({
      log(info, next) {
        (info.level === "info"
          ? console.log
          : info.level === "warn"
          ? console.warn
          : info.level === "error"
          ? console.error
          : console.debug)(info);
        next();
      },
    }),
  ],
});

export default logger;
