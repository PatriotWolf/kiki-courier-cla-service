import { CostFormatter } from './CostFormatter';
import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost';
import { ICostFormatter } from '../interfaces/ICostFormatter';

describe('CostFormatter', () => {
  let formatter: ICostFormatter;

  beforeEach(() => {
    formatter = new CostFormatter();
  });

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
