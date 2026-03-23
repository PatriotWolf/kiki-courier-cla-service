import { VehicleConfig } from '../../../shared/interfaces/VechicleConfig';
import { Package } from '../../../shared/models/Package/Package';

export interface IParser {
  parse(lines: string[]): ParsedInput;
}

export interface ParsedInput {
  baseCost: number;
  packages: Package[];
  vehicleConfig?: VehicleConfig;
}
