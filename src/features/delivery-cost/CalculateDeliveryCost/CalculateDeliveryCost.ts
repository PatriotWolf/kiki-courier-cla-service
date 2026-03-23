import { Package } from '../../../shared/models/Package/Package';
import { IOfferService } from '../interfaces/IOfferService';
import { CostResult } from './interfaces/CostResult';
import { calculateRawCost } from './utils/calculate-raw-cost';

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
