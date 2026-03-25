import { IShipmentSelector } from '../interfaces/IShipmentSelector';
import {
  IDeliveryScheduler,
  DeliveryResult,
} from '../interfaces/IDeliveryScheduler';
import { Package } from '../../../shared/models/Package';
import { Vehicle } from '../interfaces/Vehicle';
import { floorToTwoDecimals } from '../utils/math';
import { VehicleConfig } from '../../../shared/interfaces/VechicleConfig';
import { logger } from '../../../shared/logger';

export class DeliveryScheduler implements IDeliveryScheduler {
  constructor(private readonly selector: IShipmentSelector) {}

  schedule(
    packages: Package[],
    vehicleConfig: VehicleConfig,
  ): DeliveryResult[] {
    const { maxWeight, numVehicles, speed } = vehicleConfig;

    logger.info('DeliveryScheduler: starting delivery scheduling', {
      packageCount: packages.length,
      numVehicles,
      speed,
      maxWeight,
    });

    const vehicles = this.createVehicles(numVehicles);
    const remaining = [...packages];
    const results: DeliveryResult[] = [];

    while (remaining.length > 0) {
      const vehicle = this.getEarliestVehicle(vehicles);

      logger.debug('DeliveryScheduler: selected vehicle', {
        vehicleId: vehicle.id,
        availableAt: vehicle.availableAt,
        remainingPackages: remaining.length,
      });

      const shipment = this.selector.select(remaining, maxWeight);

      if (shipment.length === 0) break;

      logger.debug('DeliveryScheduler: shipment selected', {
        vehicleId: vehicle.id,
        shipmentIds: shipment.map((p) => p.id),
        totalWeight: shipment.reduce((s, p) => s + p.weight, 0),
      });

      this.processShipment(vehicle, shipment, speed, results, remaining);
    }

    logger.info('DeliveryScheduler: scheduling complete', {
      packageCount: results.length,
    });

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
      const deliveryTime = this.calculateDeliveryTime(
        vehicle.availableAt,
        pkg.distance,
        speed,
      );

      logger.debug('DeliveryScheduler: package delivered', {
        vehicleId: vehicle.id,
        packageId: pkg.id,
        distance: pkg.distance,
        deliveryTime,
      });

      results.push({
        id: pkg.id,
        deliveryTime,
      });

      remaining.splice(remaining.indexOf(pkg), 1);
    }

    const previousAvailableAt = vehicle.availableAt;

    // key: floor(maxDistance/speed) first, then double, then add
    vehicle.availableAt =
      vehicle.availableAt + 2 * floorToTwoDecimals(maxDistance / speed);

    logger.debug('DeliveryScheduler: vehicle returning', {
      vehicleId: vehicle.id,
      maxDistance,
      previousAvailableAt,
      nextAvailableAt: vehicle.availableAt,
    });
  }

  private calculateDeliveryTime(
    availableAt: number,
    distance: number,
    speed: number,
  ): number {
    return floorToTwoDecimals(availableAt + distance / speed);
  }
}
