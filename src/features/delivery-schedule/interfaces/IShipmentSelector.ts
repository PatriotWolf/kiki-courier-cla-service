import { Package } from '../../../shared/models/Package';

export interface IShipmentSelector {
  select(packages: Package[], maxWeight: number): Package[];
}
