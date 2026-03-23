import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
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
    it.todo('formats package id discount total cost and delivery time');
    it.todo('formats multiple results with delivery time in order');
  });
});
