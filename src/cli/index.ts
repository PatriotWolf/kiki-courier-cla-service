import * as readline from 'readline';
import { StdinParser } from '../infrastructure/parsers/StdinParser/StdinParser';
import { ConsoleFormatter } from '../infrastructure/formatters/ConsoleFormatter/ConsoleFormatter';
import { InMemoryOfferRepository } from '../features/delivery-cost/repositories/InMemoryOfferRepository/InMemoryOfferRepository';
import { OfferService } from '../features/delivery-cost/services/OfferService/OfferService';
import { CalculateDeliveryCost } from '../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';

const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];

rl.on('line', (line) => lines.push(line.trim()));

rl.on('close', () => {
  const parser = new StdinParser();
  const formatter = new ConsoleFormatter();
  const offerRepo = new InMemoryOfferRepository();
  const offerService = new OfferService(offerRepo);
  const calculateDeliveryCost = new CalculateDeliveryCost(offerService);

  const { baseCost, packages } = parser.parse(lines);
  const results = calculateDeliveryCost.execute(baseCost, packages);
  const output = formatter.formatCosts(results);

  output.forEach((line) => console.log(line));
});
