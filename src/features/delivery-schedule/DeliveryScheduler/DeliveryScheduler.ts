import { IShipmentSelector } from '../interfaces/IShipmentSelector';
import {
  IDeliveryScheduler,
  DeliveryResult,
} from '../interfaces/IDeliveryScheduler';
import { Package } from '../../../shared/models/Package/Package';
import { Vehicle } from '../interfaces/Vehicle';
import { floorToTwoDecimals } from '../utils/math';
import { VehicleConfig } from '../../../shared/interfaces/VechicleConfig';

export class DeliveryScheduler implements IDeliveryScheduler {
  constructor(private readonly selector: IShipmentSelector) {}

  schedule(
    packages: Package[],
    vehicleConfig: VehicleConfig,
  ): DeliveryResult[] {
    const { maxWeight, numVehicles, speed } = vehicleConfig;
    const vehicles = this.createVehicles(numVehicles);
    const remaining = [...packages];
    const results: DeliveryResult[] = [];

    while (remaining.length > 0) {
      const vehicle = this.getEarliestVehicle(vehicles);
      const shipment = this.selector.select(remaining, maxWeight);

      if (shipment.length === 0) break;

      this.processShipment(vehicle, shipment, speed, results, remaining);
    }

    return results;
  }

  private createVehicles(numVehicles: number): Vehicle[] {
    return Array.from({ length: numVehicles }, (_, i) => ({
      id: i + 1,
      availableAt: 0,
    }));
  }

  private getEarliestVehicle(vehicles: Vehicle[]): Vehicle {
    return vehicles.reduce((earliest, vehicle) =>
      vehicle.availableAt < earliest.availableAt ? vehicle : earliest,
    );
  }

  private processShipment(
    vehicle: Vehicle,
    shipment: Package[],
    speed: number,
    results: DeliveryResult[],
    remaining: Package[],
  ): void {
    const maxDistance = Math.max(...shipment.map((p) => p.distance));

    for (const pkg of shipment) {
      results.push({
        id: pkg.id,
        deliveryTime: this.calculateDeliveryTime(
          vehicle.availableAt,
          pkg.distance,
          speed,
        ),
      });
      remaining.splice(remaining.indexOf(pkg), 1);
    }

    // key: floor(maxDistance/speed) first, then double, then add
    vehicle.availableAt =
      vehicle.availableAt + 2 * floorToTwoDecimals(maxDistance / speed);
  }

  private calculateDeliveryTime(
    availableAt: number,
    distance: number,
    speed: number,
  ): number {
    return floorToTwoDecimals(availableAt + distance / speed);
  }
}
