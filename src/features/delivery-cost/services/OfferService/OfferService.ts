import { Offer } from '../../../../shared/interfaces/Offer';
import { logger } from '../../../../shared/logger';
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
    logger.debug('OfferService: getting discount', {
      code,
      weight,
      distance,
      rawCost,
    });

    if (!code || code === 'NA') {
      logger.debug('OfferService: no offer code provided');
      return 0;
    }

    const offer = this.repo.findByCode(code);
    if (!offer) {
      logger.debug('OfferService: offer code not found', { code });
      return 0;
    }

    if (!this.isEligible(offer, weight, distance)) {
      logger.debug('OfferService: offer criteria not met', {
        code,
        weight,
        distance,
        minWeight: offer.minWeight,
        maxWeight: offer.maxWeight,
        minDistance: offer.minDistance,
        maxDistance: offer.maxDistance,
      });
      return 0;
    }

    const discount = this.applyDiscount(offer, rawCost);

    logger.info('OfferService: discount applied', {
      code,
      discountPercent: offer.discountPercent,
      rawCost,
      discount,
    });

    return discount;
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
