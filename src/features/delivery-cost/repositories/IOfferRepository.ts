import { Offer } from '../../../shared/interfaces/Offer';

export interface IOfferRepository {
  findByCode(code: string): Offer | undefined;
}
