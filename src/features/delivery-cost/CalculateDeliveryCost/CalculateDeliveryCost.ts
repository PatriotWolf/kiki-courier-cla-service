import { Package } from '../../../shared/models/Package/Package';
import { IOfferService } from '../interfaces/IOfferService';
import { calculateRawCost } from './utils/calculate-raw-cost';

export interface CostResult {
  id: string;
  discount: number;
  totalCost: number;
}

export class CalculateDeliveryCost {
  constructor(private readonly offerService: IOfferService) {}

  execute(baseCost: number, packages: Package[]): CostResult[] {
    return packages.map((pkg) => this.processPackage(baseCost, pkg));
  }

  private processPackage(baseCost: number, pkg: Package): CostResult {
    const rawCost = calculateRawCost(baseCost, pkg.weight, pkg.distance);
    const discount = this.offerService.getDiscount(
      pkg.offerCode,
      pkg.weight,
      pkg.distance,
      rawCost,
    );
    return {
      id: pkg.id,
      discount,
      totalCost: rawCost - discount,
    };
  }
}
