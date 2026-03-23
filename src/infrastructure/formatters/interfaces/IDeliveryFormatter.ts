import { CostResult } from '../../../features/delivery-cost/CalculateDeliveryCost/CalculateDeliveryCost';
import { DeliveryResult } from '../../../features/delivery-schedule/interfaces/IDeliveryScheduler';

export interface IDeliveryFormatter {
  formatDelivery(cost: CostResult, delivery: DeliveryResult): string;
  formatDeliveries(costs: CostResult[], deliveries: DeliveryResult[]): string[];
}
