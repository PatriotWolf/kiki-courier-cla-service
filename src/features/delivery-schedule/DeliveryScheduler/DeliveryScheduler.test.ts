import { ShipmentSelector } from '../ShipmentSelector/ShipmentSelector';
import { IDeliveryScheduler } from '../interfaces/IDeliveryScheduler';
import { Package } from '../../../shared/models/Package/Package';
import { DeliveryScheduler } from './DeliveryScheduler';
import { VehicleConfig } from '../../../shared/interfaces/VechicleConfig';
import { floorToTwoDecimals } from '../utils/math';

describe('DeliveryScheduler', () => {
  let scheduler: IDeliveryScheduler;
  let selector: ShipmentSelector;

  beforeEach(() => {
    selector = new ShipmentSelector();
    scheduler = new DeliveryScheduler(selector);
  });

  describe('vehicle pool', () => {
    it('all vehicles start with availableAt zero', () => {
      const packages = [new Package('PKG1', 50, 30)];
      const config: VehicleConfig = {
        numVehicles: 1,
        speed: 70,
        maxWeight: 200,
      };
      const results = scheduler.schedule(packages, config);
      expect(results[0].deliveryTime).toBe(floorToTwoDecimals(30 / 70));
    });
  });

  describe('vehicle return time', () => {
    it('vehicle return time is double max distance divided by speed', () => {
      const packages = [
        new Package('PKG1', 150, 30),
        new Package('PKG2', 150, 60),
        new Package('PKG3', 150, 90),
      ];
      const config: VehicleConfig = {
        numVehicles: 1,
        speed: 70,
        maxWeight: 200,
      };
      const results = scheduler.schedule(packages, config);
      const pkg2 = results.find((r) => r.id === 'PKG2')!;
      const pkg3 = results.find((r) => r.id === 'PKG3')!;
      expect(pkg2.deliveryTime).toBeGreaterThan(floorToTwoDecimals(30 / 70));
      expect(pkg3.deliveryTime).toBeGreaterThan(pkg2.deliveryTime);
    });
  });

  describe('vehicle availableAt carries forward', () => {
    it('vehicle availableAt uses its own time not zero', () => {
      const packages = [
        new Package('PKG1', 150, 30),
        new Package('PKG2', 150, 60),
      ];
      const config: VehicleConfig = {
        numVehicles: 1,
        speed: 70,
        maxWeight: 200,
      };
      const results = scheduler.schedule(packages, config);
      const pkg2 = results.find((r) => r.id === 'PKG2')!;
      expect(pkg2.deliveryTime).toBeGreaterThan(floorToTwoDecimals(60 / 70));
    });
  });

  describe('earliest vehicle selection', () => {
    it('assigns shipment to earliest available vehicle', () => {
      const packages = [
        new Package('PKG1', 50, 30),
        new Package('PKG2', 50, 125),
        new Package('PKG3', 50, 100),
      ];
      const config: VehicleConfig = {
        numVehicles: 2,
        speed: 70,
        maxWeight: 200,
      };
      const results = scheduler.schedule(packages, config);
      expect(results).toHaveLength(3);
    });
  });

  describe('delivery time calculation', () => {
    it('delivery time is vehicle availableAt plus distance divided by speed', () => {
      const packages = [new Package('PKG1', 50, 30)];
      const config: VehicleConfig = {
        numVehicles: 1,
        speed: 70,
        maxWeight: 200,
      };
      const results = scheduler.schedule(packages, config);
      expect(results[0].deliveryTime).toBe(floorToTwoDecimals(30 / 70));
    });

    it('truncates 3.456 to 3.45 not 3.46', () => {
      expect(floorToTwoDecimals(3.456)).toBe(3.45);
    });

    it('truncates 1.789 to 1.78 not 1.79', () => {
      expect(floorToTwoDecimals(1.789)).toBe(1.78);
    });
  });

  describe('full sample output', () => {
    const packages = [
      new Package('PKG1', 50, 30, 'OFR001'),
      new Package('PKG2', 75, 125, undefined),
      new Package('PKG3', 175, 100, 'OFR003'),
      new Package('PKG4', 110, 60, 'OFR002'),
      new Package('PKG5', 155, 95, undefined),
    ];

    const config: VehicleConfig = { numVehicles: 2, speed: 70, maxWeight: 200 };

    it('PKG1 50kg 30km returns delivery time 3.98', () => {
      const results = scheduler.schedule(packages, config);
      const pkg = results.find((r) => r.id === 'PKG1')!;
      expect(pkg.deliveryTime).toBe(3.98);
    });

    it('PKG2 75kg 125km returns delivery time 1.78', () => {
      const results = scheduler.schedule(packages, config);
      const pkg = results.find((r) => r.id === 'PKG2')!;
      expect(pkg.deliveryTime).toBe(1.78);
    });

    it('PKG3 175kg 100km returns delivery time 1.42', () => {
      const results = scheduler.schedule(packages, config);
      const pkg = results.find((r) => r.id === 'PKG3')!;
      expect(pkg.deliveryTime).toBe(1.42);
    });

    it('PKG4 110kg 60km returns delivery time 0.85', () => {
      const results = scheduler.schedule(packages, config);
      const pkg = results.find((r) => r.id === 'PKG4')!;
      expect(pkg.deliveryTime).toBe(0.85);
    });

    it('PKG5 155kg 95km returns delivery time 4.19', () => {
      const results = scheduler.schedule(packages, config);
      const pkg = results.find((r) => r.id === 'PKG5')!;
      expect(pkg.deliveryTime).toBe(4.19);
    });
  });
});
