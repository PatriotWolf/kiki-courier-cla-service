import { Offer } from '../../../../shared/interfaces/Offer';
import { IOfferRepository } from '../IOfferRepository';

/**
 *   NOTE: For this project, we use In memory approach as no DB setup and file dump mentioned.
 */

export class InMemoryOfferRepository implements IOfferRepository {
  private readonly offers: Offer[] = [
    {
      code: 'OFR001',
      discountPercent: 10,
      minDistance: 0,
      maxDistance: 199,
      minWeight: 70,
      maxWeight: 200,
    },
    {
      code: 'OFR002',
      discountPercent: 7,
      minDistance: 50,
      maxDistance: 150,
      minWeight: 100,
      maxWeight: 250,
    },
    {
      code: 'OFR003',
      discountPercent: 5,
      minDistance: 50,
      maxDistance: 250,
      minWeight: 10,
      maxWeight: 150,
    },
  ];

  findByCode(code: string): Offer | undefined {
    return this.offers.find((offer) => offer.code === code);
  }
}
