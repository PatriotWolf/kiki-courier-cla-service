import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
import { ICostFormatter } from '../interfaces/ICostFormatter';

export class CostFormatter implements ICostFormatter {
  formatCost(result: CostResult): string {
    return `${result.id} ${result.discount} ${result.totalCost}`;
  }

  formatCosts(results: CostResult[]): string[] {
    return results.map((r) => this.formatCost(r));
  }
}
