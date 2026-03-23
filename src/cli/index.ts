import * as readline from 'readline';
import { StdinParser } from '../infrastructure/parsers/StdinParser/StdinParser';
import { CostFormatter } from '../infrastructure/formatters/CostFormatter';
import { InMemoryOfferRepository } from '../features/delivery-cost/repositories/InMemoryOfferRepository/InMemoryOfferRepository';
import { OfferService } from '../features/delivery-cost/services/OfferService/OfferService';
import { CalculateDeliveryCost } from '../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';

const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];

rl.on('line', (line) => lines.push(line.trim()));

rl.on('close', () => {
  const parser = new StdinParser();
  const costFormatter = new CostFormatter();
  const offerRepo = new InMemoryOfferRepository();
  const offerService = new OfferService(offerRepo);
  const calculateDeliveryCost = new CalculateDeliveryCost(offerService);

  const { baseCost, packages } = parser.parse(lines);
  const results = calculateDeliveryCost.execute(baseCost, packages);
  const output = costFormatter.formatCosts(results);

  output.forEach((line) => console.log(line));
});
