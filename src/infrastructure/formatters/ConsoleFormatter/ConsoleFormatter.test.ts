import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
import { DeliveryResult } from '../../../features/delivery-schedule/interfaces/IDeliveryScheduler';
import { ConsoleFormatter } from './ConsoleFormatter';

describe('ConsoleFormatter', () => {
  let formatter: ConsoleFormatter;

  beforeEach(() => {
    formatter = new ConsoleFormatter();
  });

  describe('problem 01 output', () => {
    it('formats package id discount and total cost', () => {
      const result: CostResult = { id: 'PKG3', discount: 35, totalCost: 665 };
      expect(formatter.formatCost(result)).toBe('PKG3 35 665');
    });

    it('formats zero discount correctly', () => {
      const result: CostResult = { id: 'PKG1', discount: 0, totalCost: 175 };
      expect(formatter.formatCost(result)).toBe('PKG1 0 175');
    });

    it('formats multiple results in order', () => {
      const results: CostResult[] = [
        { id: 'PKG1', discount: 0, totalCost: 175 },
        { id: 'PKG2', discount: 0, totalCost: 275 },
        { id: 'PKG3', discount: 35, totalCost: 665 },
      ];
      expect(formatter.formatCosts(results)).toEqual([
        'PKG1 0 175',
        'PKG2 0 275',
        'PKG3 35 665',
      ]);
    });
  });
  describe('problem 02 output', () => {
    it('formats package id discount total cost and delivery time', () => {
      const cost: CostResult = { id: 'PKG4', discount: 105, totalCost: 1395 };
      const delivery: DeliveryResult = { id: 'PKG4', deliveryTime: 0.85 };
      expect(formatter.formatDelivery(cost, delivery)).toBe(
        'PKG4 105 1395 0.85',
      );
    });

    it('formats multiple results with delivery time in order', () => {
      const costs: CostResult[] = [
        { id: 'PKG1', discount: 0, totalCost: 750 },
        { id: 'PKG2', discount: 0, totalCost: 1475 },
      ];
      const deliveries: DeliveryResult[] = [
        { id: 'PKG1', deliveryTime: 3.98 },
        { id: 'PKG2', deliveryTime: 1.78 },
      ];
      expect(formatter.formatDeliveries(costs, deliveries)).toEqual([
        'PKG1 0 750 3.98',
        'PKG2 0 1475 1.78',
      ]);
    });
  });
});
