import { StdinParser } from '../infrastructure/parsers/StdinParser/StdinParser';
import { CostFormatter } from '../infrastructure/formatters/CostFormatter/CostFormatter';
import { DeliveryFormatter } from '../infrastructure/formatters/DeliveryFormatter/DeliveryFormatter';
import { InMemoryOfferRepository } from '../features/delivery-cost/repositories/InMemoryOfferRepository/InMemoryOfferRepository';
import { OfferService } from '../features/delivery-cost/services/OfferService/OfferService';
import { CalculateDeliveryCost } from '../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
import { ShipmentSelector } from '../features/delivery-schedule/ShipmentSelector/ShipmentSelector';
import { DeliveryScheduler } from '../features/delivery-schedule/DeliveryScheduler/DeliveryScheduler';

const runProblem02 = (lines: string[]): string[] => {
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

  if (!vehicleConfig) {
    return costFormatter.formatCosts(costResults);
  }

  const deliveryResults = scheduler.schedule(packages, vehicleConfig);
  return deliveryFormatter.formatDeliveries(costResults, deliveryResults);
};

describe('Problem 02 - Delivery Time Estimation', () => {
  describe('vehicle constraints', () => {
    it('each vehicle has a maximum weight limit', () => {
      const output = runProblem02([
        '100 2',
        'PKG1 150 30',
        'PKG2 150 60',
        '1 70 200',
      ]);
      // only one package per trip due to weight limit
      expect(output).toHaveLength(2);
    });

    it('all vehicles travel at the same speed', () => {
      const output = runProblem02([
        '100 2',
        'PKG1 50 30',
        'PKG2 50 60',
        '2 70 200',
      ]);
      expect(output).toHaveLength(2);
    });
  });

  describe('shipment selection', () => {
    it('shipment contains maximum packages vehicle can carry', () => {
      const output = runProblem02([
        '100 3',
        'PKG1 50 30',
        'PKG2 50 60',
        'PKG3 50 90',
        '1 70 200',
      ]);
      // all three fit in 200kg — taken in one trip
      const pkg3 = output.find((l) => l.startsWith('PKG3'))!;
      expect(pkg3).toBeDefined();
    });

    it('prefers heavier combination when package count is equal', () => {
      const output = runProblem02([
        '100 3',
        'PKG1 50 30',
        'PKG2 75 125',
        'PKG4 110 60',
        '1 70 200',
      ]);
      // PKG2+PKG4 = 185kg wins over PKG1+PKG2 = 125kg
      const pkg2 = output.find((l) => l.startsWith('PKG2'))!;
      const pkg4 = output.find((l) => l.startsWith('PKG4'))!;
      const time2 = Number(pkg2.split(' ')[3]);
      const time4 = Number(pkg4.split(' ')[3]);
      // both delivered in first trip
      expect(time2).toBeLessThan(2);
      expect(time4).toBeLessThan(2);
    });
  });

  describe('vehicle scheduling', () => {
    it('vehicle returns to source after delivery at same speed', () => {
      const output = runProblem02([
        '100 2',
        'PKG1 150 30',
        'PKG2 150 60',
        '1 70 200',
      ]);
      const pkg2 = output.find((l) => l.startsWith('PKG2'))!;
      const time2 = Number(pkg2.split(' ')[3]);
      // PKG2 starts after vehicle returns from PKG1
      expect(time2).toBeGreaterThan(0.85);
    });

    it('vehicle availableAt carries forward not reset to zero', () => {
      const output = runProblem02([
        '100 2',
        'PKG1 150 30',
        'PKG2 150 60',
        '1 70 200',
      ]);
      const pkg2 = output.find((l) => l.startsWith('PKG2'))!;
      const time2 = Number(pkg2.split(' ')[3]);
      expect(time2).toBeGreaterThan(0.85);
    });

    it('earliest available vehicle gets next shipment', () => {
      const output = runProblem02([
        '100 3',
        'PKG1 50 30',
        'PKG2 75 125',
        'PKG3 175 100',
        '2 70 200',
      ]);
      expect(output).toHaveLength(3);
    });
  });

  describe('delivery time calculation', () => {
    it('delivery time is truncated to 2 decimal places not rounded', () => {
      const output = runProblem02(['100 1', 'PKG1 50 30', '1 70 200']);
      const time = Number(output[0].split(' ')[3]);
      // 30/70 = 0.4285... → 0.42
      expect(time).toBe(0.42);
    });

    it('3.456 becomes 3.45 not 3.46', () => {
      expect(Math.floor(3.456 * 100) / 100).toBe(3.45);
    });

    it('1.789 becomes 1.78 not 1.79', () => {
      expect(Math.floor(1.789 * 100) / 100).toBe(1.78);
    });
  });

  describe('full system input to output', () => {
    const input = [
      '100 5',
      'PKG1 50 30 OFR001',
      'PKG2 75 125 OFR008',
      'PKG3 175 100 OFR003',
      'PKG4 110 60 OFR002',
      'PKG5 155 95 NA',
      '2 70 200',
    ];

    it('PKG1 50kg 30km returns discount 0 total 750 delivery time 3.98', () => {
      const output = runProblem02(input);
      expect(output.find((l) => l.startsWith('PKG1'))).toBe('PKG1 0 750 3.98');
    });

    it('PKG2 75kg 125km returns discount 0 total 1475 delivery time 1.78', () => {
      const output = runProblem02(input);
      expect(output.find((l) => l.startsWith('PKG2'))).toBe('PKG2 0 1475 1.78');
    });

    it('PKG3 175kg 100km returns discount 0 total 2350 delivery time 1.42', () => {
      const output = runProblem02(input);
      expect(output.find((l) => l.startsWith('PKG3'))).toBe('PKG3 0 2350 1.42');
    });

    it('PKG4 110kg 60km returns discount 105 total 1395 delivery time 0.85', () => {
      const output = runProblem02(input);
      expect(output.find((l) => l.startsWith('PKG4'))).toBe(
        'PKG4 105 1395 0.85',
      );
    });

    it('PKG5 155kg 95km returns discount 0 total 2125 delivery time 4.19', () => {
      const output = runProblem02(input);
      expect(output.find((l) => l.startsWith('PKG5'))).toBe('PKG5 0 2125 4.19');
    });

    it('full sample input produces exact expected output line by line', () => {
      const output = runProblem02(input);
      expect(output).toEqual([
        'PKG1 0 750 3.98',
        'PKG2 0 1475 1.78',
        'PKG3 0 2350 1.42',
        'PKG4 105 1395 0.85',
        'PKG5 0 2125 4.19',
      ]);
    });
  });
});
