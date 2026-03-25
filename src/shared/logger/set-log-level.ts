import { logger } from './logger';

export const setLogLevel = (level: string): void => {
  logger.level = level;
  logger.transports.forEach((t) => {
    t.level = level;
  });
};
