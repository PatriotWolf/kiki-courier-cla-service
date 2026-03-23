import { InvalidInputError } from '../../../shared/errors/DomainErrors';
import { Package } from '../../../shared/models/Package/Package';
import { IParser } from '../interfaces/IParser';

export interface VehicleConfig {
  numVehicles: number;
  speed: number;
  maxWeight: number;
}

export interface ParsedInput {
  baseCost: number;
  packages: Package[];
  vehicleConfig?: VehicleConfig;
}

export class StdinParser implements IParser {
  parse(lines: string[]): ParsedInput {
    if (!lines || lines.length === 0) {
      throw new InvalidInputError('Input cannot be empty');
    }

    const firstLine = lines[0].trim().split(' ');
    if (firstLine.length < 2) {
      throw new InvalidInputError(
        'First line must contain base cost and number of packages',
      );
    }

    const baseCost = Number(firstLine[0]);
    const numPackages = Number(firstLine[1]);

    if (isNaN(baseCost)) {
      throw new InvalidInputError(`Invalid base cost: ${firstLine[0]}`);
    }

    if (lines.length < numPackages + 1) {
      throw new InvalidInputError('Not enough package lines in input');
    }

    const packages = this.parsePackages(lines, numPackages);
    const vehicleConfig = this.parseVehicleConfig(lines, numPackages);

    return { baseCost, packages, vehicleConfig };
  }

  private parsePackages(lines: string[], numPackages: number): Package[] {
    const packages: Package[] = [];

    for (let i = 1; i <= numPackages; i++) {
      const parts = lines[i].trim().split(' ');
      const [id, weight, distance, offerCode] = parts;

      packages.push(
        new Package(
          id,
          Number(weight),
          Number(distance),
          this.parseOfferCode(offerCode),
        ),
      );
    }

    return packages;
  }

  private parseVehicleConfig(
    lines: string[],
    numPackages: number,
  ): VehicleConfig | undefined {
    const vehicleLine = lines[numPackages + 1];
    if (!vehicleLine) return undefined;

    const parts = vehicleLine.trim().split(' ');
    if (parts.length < 3) {
      throw new InvalidInputError(
        'Vehicle configuration must contain num vehicles speed and max weight',
      );
    }

    const numVehicles = Number(parts[0]);
    const speed = Number(parts[1]);
    const maxWeight = Number(parts[2]);

    if (isNaN(numVehicles) || isNaN(speed) || isNaN(maxWeight)) {
      throw new InvalidInputError(
        'Vehicle configuration contains invalid numbers',
      );
    }

    return { numVehicles, speed, maxWeight };
  }

  private parseOfferCode(code: string | undefined): string | undefined {
    if (!code || code === 'NA') return undefined;
    return code;
  }
}
