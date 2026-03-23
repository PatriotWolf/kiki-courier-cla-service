import { Package } from '../../../shared/models/Package/Package';
import { VehicleConfig } from '../StdinParser';

export interface IParser {
  parse(lines: string[]): ParsedInput;
}

export interface ParsedInput {
  baseCost: number;
  packages: Package[];
  vehicleConfig?: VehicleConfig;
}
