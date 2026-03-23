import * as readline from 'readline';
import { StdinParser } from '../infrastructure/parsers/StdinParser/StdinParser';
import { CostFormatter } from '../infrastructure/formatters/CostFormatter';
import { DeliveryFormatter } from '../infrastructure/formatters/DeliveryFormatter';
import { InMemoryOfferRepository } from '../features/delivery-cost/repositories/InMemoryOfferRepository/InMemoryOfferRepository';
import { OfferService } from '../features/delivery-cost/services/OfferService/OfferService';
import { CalculateDeliveryCost } from '../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
import { ShipmentSelector } from '../features/delivery-schedule/ShipmentSelector/ShipmentSelector';
import { DeliveryScheduler } from '../features/delivery-schedule/DeliveryScheduler/DeliveryScheduler';

const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];

rl.on('line', (line) => lines.push(line.trim()));

rl.on('close', () => {
  // infrastructure
  const parser = new StdinParser();
  const costFormatter = new CostFormatter();
  const deliveryFormatter = new DeliveryFormatter();

  // delivery cost
  const offerRepo = new InMemoryOfferRepository();
  const offerService = new OfferService(offerRepo);
  const calculateDeliveryCost = new CalculateDeliveryCost(offerService);

  // delivery schedule
  const selector = new ShipmentSelector();
  const scheduler = new DeliveryScheduler(selector);

  // parse
  const { baseCost, packages, vehicleConfig } = parser.parse(lines);

  // calculate costs
  const costResults = calculateDeliveryCost.execute(baseCost, packages);

  // problem 01
  if (!vehicleConfig) {
    costFormatter.formatCosts(costResults).forEach((line) => console.log(line));
    return;
  }

  // problem 02
  const deliveryResults = scheduler.schedule(packages, vehicleConfig);
  deliveryFormatter
    .formatDeliveries(costResults, deliveryResults)
    .forEach((line) => console.log(line));
});
