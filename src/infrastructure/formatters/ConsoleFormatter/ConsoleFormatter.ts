import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';

export class ConsoleFormatter {
  formatCost(result: CostResult): string {
    return `${result.id} ${result.discount} ${result.totalCost}`;
  }

  formatCosts(results: CostResult[]): string[] {
    return results.map((r) => this.formatCost(r));
  }
}
