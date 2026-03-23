import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost';
import { DeliveryResult } from '../../../features/delivery-schedule/interfaces/IDeliveryScheduler';
import { IDeliveryFormatter } from '../interfaces/IDeliveryFormatter';

export class DeliveryFormatter implements IDeliveryFormatter {
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
