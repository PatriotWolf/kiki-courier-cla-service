import { InvalidInputError } from '../../../shared/errors/DomainErrors';
import { VehicleConfig } from '../../../shared/interfaces/VechicleConfig';
import { logger } from '../../../shared/logger';
import { Package } from '../../../shared/models/Package';
import { IParser, ParsedInput } from '../interfaces/IParser';

export class StdinParser implements IParser {
  parse(lines: string[]): ParsedInput {
    logger.debug('StdinParser: parsing input', { lineCount: lines.length });

    if (!lines || lines.length === 0) {
      logger.error('StdinParser: input is empty');
      throw new InvalidInputError('Input cannot be empty');
    }

    const firstLine = lines[0].trim().split(' ');
    if (firstLine.length < 2) {
      logger.error('StdinParser: first line is invalid', { line: lines[0] });
      throw new InvalidInputError(
        'First line must contain base cost and number of packages',
      );
    }

    const baseCost = Number(firstLine[0]);
    const numPackages = Number(firstLine[1]);

    if (isNaN(baseCost)) {
      logger.error('StdinParser: invalid base cost', { value: firstLine[0] });
      throw new InvalidInputError(`Invalid base cost: ${firstLine[0]}`);
    }

    if (lines.length < numPackages + 1) {
      logger.error('StdinParser: not enough package lines', {
        expected: numPackages,
        received: lines.length - 1,
      });
      throw new InvalidInputError('Not enough package lines in input');
    }

    const packages = this.parsePackages(lines, numPackages);
    const vehicleConfig = this.parseVehicleConfig(lines, numPackages);

    logger.info('StdinParser: parsed input successfully', {
      baseCost,
      packageCount: packages.length,
      hasVehicleConfig: !!vehicleConfig,
    });

    return { baseCost, packages, vehicleConfig };
  }

  private parsePackages(lines: string[], numPackages: number): Package[] {
    const packages: Package[] = [];

    for (let i = 1; i <= numPackages; i++) {
      const parts = lines[i].trim().split(' ');
      const [id, weight, distance, offerCode] = parts;

      logger.debug('StdinParser: parsing package', {
        id,
        weight,
        distance,
        offerCode,
      });

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
      logger.error('StdinParser: invalid vehicle configuration', {
        line: vehicleLine,
      });
      throw new InvalidInputError(
        'Vehicle configuration must contain num vehicles speed and max weight',
      );
    }

    const numVehicles = Number(parts[0]);
    const speed = Number(parts[1]);
    const maxWeight = Number(parts[2]);

    if (isNaN(numVehicles) || isNaN(speed) || isNaN(maxWeight)) {
      logger.error(
        'StdinParser: vehicle configuration contains invalid numbers',
        { numVehicles, speed, maxWeight },
      );
      throw new InvalidInputError(
        'Vehicle configuration contains invalid numbers',
      );
    }

    logger.debug('StdinParser: parsed vehicle config', {
      numVehicles,
      speed,
      maxWeight,
    });

    return { numVehicles, speed, maxWeight };
  }

  private parseOfferCode(code: string | undefined): string | undefined {
    if (!code || code === 'NA') return undefined;
    return code;
  }
}
