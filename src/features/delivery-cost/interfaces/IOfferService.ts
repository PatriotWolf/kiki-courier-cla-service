export interface IOfferService {
  getDiscount(
    code: string | undefined,
    weight: number,
    distance: number,
    rawCost: number,
  ): number;
}
