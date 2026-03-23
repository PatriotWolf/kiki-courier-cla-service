import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
import { DeliveryResult } from '../../../features/delivery-schedule/interfaces/IDeliveryScheduler';

export class ConsoleFormatter {
  formatCost(result: CostResult): string {
    return `${result.id} ${result.discount} ${result.totalCost}`;
  }

  formatCosts(results: CostResult[]): string[] {
    return results.map((r) => this.formatCost(r));
  }
  formatDelivery(cost: CostResult, delivery: DeliveryResult): string {
    return `${cost.id} ${cost.discount} ${cost.totalCost} ${delivery.deliveryTime}`;
  }
  formatDeliveries(
    costs: CostResult[],
    deliveries: DeliveryResult[],
  ): string[] {
    return costs.map((cost) => {
      const delivery = deliveries.find((d) => d.id === cost.id)!;
      return this.formatDelivery(cost, delivery);
    });
  }
}
