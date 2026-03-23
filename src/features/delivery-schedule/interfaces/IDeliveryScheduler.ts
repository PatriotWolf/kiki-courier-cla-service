import { Package } from '../../../shared/models/Package/Package';

export interface DeliveryResult {
  id: string;
  deliveryTime: number;
}

export interface IDeliveryScheduler {
  schedule(
    packages: Package[],
    numVehicles: number,
    speed: number,
    maxWeight: number,
  ): DeliveryResult[];
}
