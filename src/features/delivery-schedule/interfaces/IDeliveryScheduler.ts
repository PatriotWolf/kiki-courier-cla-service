import { VehicleConfig } from '../../../shared/interfaces/VechicleConfig';
import { Package } from '../../../shared/models/Package';

export interface DeliveryResult {
  id: string;
  deliveryTime: number;
}

export interface IDeliveryScheduler {
  schedule(packages: Package[], vehicleConfig: VehicleConfig): DeliveryResult[];
}
