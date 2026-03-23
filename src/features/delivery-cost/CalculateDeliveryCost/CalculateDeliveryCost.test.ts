import { Package } from '../../../shared/models/Package/Package';
import { IOfferService } from '../interfaces/IOfferService';
import { InMemoryOfferRepository } from '../repositories/InMemoryOfferRepository';
import { OfferService } from '../services/OfferService';
import { CalculateDeliveryCost } from './CalculateDeliveryCost';

describe('CalculateDeliveryCost', () => {
  let useCase: CalculateDeliveryCost;
  let offerService: IOfferService;

  beforeEach(() => {
    offerService = new OfferService(new InMemoryOfferRepository());
    useCase = new CalculateDeliveryCost(offerService);
  });
  describe('given base cost and single package', () => {
    it('PKG1 5kg 5km OFR001 criteria not met returns discount 0 total 175', () => {
      const result = useCase.execute(100, [
        new Package('PKG1', 5, 5, 'OFR001'),
      ]);
      expect(result[0].discount).toBe(0);
      expect(result[0].totalCost).toBe(175);
    });
    it('PKG2 15kg 5km OFR002 criteria not met returns discount 0 total 275', () => {
      const result = useCase.execute(100, [
        new Package('PKG2', 15, 5, 'OFR002'),
      ]);
      expect(result[0].discount).toBe(0);
      expect(result[0].totalCost).toBe(275);
    });

    it('PKG3 10kg 100km OFR003 criteria met returns discount 35 total 665', () => {
      const result = useCase.execute(100, [
        new Package('PKG3', 10, 100, 'OFR003'),
      ]);
      expect(result[0].discount).toBe(35);
      expect(result[0].totalCost).toBe(665);
    });
  });

  describe('given base cost and multiple packages', () => {
    it('calculates each package independently', () => {
      const results = useCase.execute(100, [
        new Package('PKG1', 5, 5, 'OFR001'),
        new Package('PKG2', 15, 5, 'OFR002'),
        new Package('PKG3', 10, 100, 'OFR003'),
      ]);
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual({ id: 'PKG1', discount: 0, totalCost: 175 });
      expect(results[1]).toEqual({ id: 'PKG2', discount: 0, totalCost: 275 });
      expect(results[2]).toEqual({ id: 'PKG3', discount: 35, totalCost: 665 });
    });
  });

  describe('when offer code is not valid', () => {
    it('returns discount 0 when offer code is NA', () => {
      const result = useCase.execute(100, [new Package('PKG1', 10, 100, 'NA')]);
      expect(result[0].discount).toBe(0);
    });

    it('returns discount 0 when offer code does not exist', () => {
      const result = useCase.execute(100, [
        new Package('PKG1', 10, 100, 'INVALID'),
      ]);
      expect(result[0].discount).toBe(0);
    });
  });
});
