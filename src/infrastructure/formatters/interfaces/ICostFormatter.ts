import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';

export interface ICostFormatter {
  formatCost(result: CostResult): string;
  formatCosts(results: CostResult[]): string[];
}
