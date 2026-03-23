import { Offer } from '../../../../shared/interfaces/Offer';
import { IOfferService } from '../../interfaces/IOfferService';
import { IOfferRepository } from '../../repositories/IOfferRepository';

export class OfferService implements IOfferService {
  constructor(private readonly repo: IOfferRepository) {}

  getDiscount(
    code: string | undefined,
    weight: number,
    distance: number,
    rawCost: number,
  ): number {
    if (!code || code === 'NA') return 0;

    const offer = this.repo.findByCode(code);
    if (!offer) return 0;

    return this.isEligible(offer, weight, distance)
      ? this.applyDiscount(offer, rawCost)
      : 0;
  }

  private isEligible(offer: Offer, weight: number, distance: number): boolean {
    const isWeightValid =
      weight >= offer.minWeight && weight <= offer.maxWeight;
    const isDistanceValid =
      distance >= offer.minDistance && distance <= offer.maxDistance;
    return isWeightValid && isDistanceValid;
  }

  private applyDiscount(offer: Offer, rawCost: number): number {
    return Math.round((offer.discountPercent / 100) * rawCost * 100) / 100;
  }
}
