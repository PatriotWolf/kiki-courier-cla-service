#!/usr/bin/env node
import * as readline from 'readline';
import { Command } from 'commander';

import { StdinParser } from '../infrastructure/parsers/StdinParser';
import { CostFormatter } from '../infrastructure/formatters/CostFormatter';
import { DeliveryFormatter } from '../infrastructure/formatters/DeliveryFormatter';
import { InMemoryOfferRepository } from '../features/delivery-cost/repositories/InMemoryOfferRepository';
import { OfferService } from '../features/delivery-cost/services/OfferService';
import { CalculateDeliveryCost } from '../features/delivery-cost/CalculateDeliveryCost';
import { ShipmentSelector } from '../features/delivery-schedule/ShipmentSelector';
import { DeliveryScheduler } from '../features/delivery-schedule/DeliveryScheduler';
import { logger, setLogLevel } from '../shared/logger';

const program = new Command();

program
  .name('kiki-courier')
  .description("Estimate delivery costs and times for Kiki's courier service")
  .version('1.0.0')
  .option('-p, --problem <number>', 'problem to solve (1 or 2)', '1')
  .option('-d, --debug', 'enable debug logging')
  .parse(process.argv);

const options = program.opts();

// set log level from flag
if (options.debug) {
  setLogLevel('debug');
}

const problem = Number(options.problem);

if (problem !== 1 && problem !== 2) {
  logger.error('cli: invalid problem number', { problem });
  console.error('Error: problem must be 1 or 2');
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];

rl.on('line', (line) => lines.push(line.trim()));

rl.on('close', () => {
  logger.debug('cli: input received', {
    lineCount: lines.length,
    problem,
  });

  try {
    const parser = new StdinParser();
    const costFormatter = new CostFormatter();
    const deliveryFormatter = new DeliveryFormatter();
    const offerRepo = new InMemoryOfferRepository();
    const offerService = new OfferService(offerRepo);
    const calculateDeliveryCost = new CalculateDeliveryCost(offerService);
    const selector = new ShipmentSelector();
    const scheduler = new DeliveryScheduler(selector);

    const { baseCost, packages, vehicleConfig } = parser.parse(lines);
    const costResults = calculateDeliveryCost.execute(baseCost, packages);

    if (problem === 1) {
      logger.info('cli: running problem 01');
      costFormatter
        .formatCosts(costResults)
        .forEach((line) => console.log(line));
      return;
    }

    if (!vehicleConfig) {
      logger.error('cli: vehicle configuration missing for problem 02');
      console.error('Error: problem 02 requires vehicle configuration line');
      process.exit(1);
    }

    logger.info('cli: running problem 02');
    const deliveryResults = scheduler.schedule(packages, vehicleConfig);
    deliveryFormatter
      .formatDeliveries(costResults, deliveryResults)
      .forEach((line) => console.log(line));
  } catch (error) {
    if (error instanceof Error) {
      logger.error('cli: unexpected error', {
        message: error.message,
        stack: error.stack,
      });
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
});
