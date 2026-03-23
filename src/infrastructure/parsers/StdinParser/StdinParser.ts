import { InvalidInputError } from '../../../shared/errors/DomainErrors';
import { Package } from '../../../shared/models/Package/Package';

export interface ParsedInput {
  baseCost: number;
  packages: Package[];
}

export class StdinParser {
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

    return { baseCost, packages };
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

  private parseOfferCode(code: string | undefined): string | undefined {
    if (!code || code === 'NA') return undefined;
    return code;
  }
}
