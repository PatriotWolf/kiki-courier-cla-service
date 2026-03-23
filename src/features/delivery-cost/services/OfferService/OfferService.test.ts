import { IOfferService } from '../../interfaces/IOfferService';
import { InMemoryOfferRepository } from '../../repositories/InMemoryOfferRepository/InMemoryOfferRepository';
import { OfferService } from './OfferService';

describe('OfferService', () => {
  let service: IOfferService;

  beforeEach(() => {
    service = new OfferService(new InMemoryOfferRepository());
  });

  describe('when offer code is not valid or not found', () => {
    it('returns 0 when offer code is undefined', () => {
      expect(service.getDiscount(undefined, 100, 100, 700)).toBe(0);
    });
    it('returns 0 when offer code is NA', () => {
      expect(service.getDiscount('NA', 100, 100, 700)).toBe(0);
    });

    it('returns 0 when offer code does not exist', () => {
      expect(service.getDiscount('INVALID', 100, 100, 700)).toBe(0);
    });
  });

  describe('OFR001 - 10% discount distance < 200 weight 70-200', () => {
    it('returns 10% discount when criteria met', () => {
      expect(service.getDiscount('OFR001', 100, 100, 700)).toBe(70);
    });

    it('returns 0 when distance is 200 or more', () => {
      expect(service.getDiscount('OFR001', 100, 200, 700)).toBe(0);
    });

    it('returns 0 when weight is less than 70', () => {
      expect(service.getDiscount('OFR001', 69, 100, 700)).toBe(0);
    });

    it('returns 0 when weight is more than 200', () => {
      expect(service.getDiscount('OFR001', 201, 100, 700)).toBe(0);
    });
  });

  describe('OFR002 - 7% discount distance 50-150 weight 100-250', () => {
    it('returns 7% discount when criteria met', () => {
      expect(service.getDiscount('OFR002', 100, 100, 700)).toBe(49);
    });

    it('returns 0 when distance is less than 50', () => {
      expect(service.getDiscount('OFR002', 100, 49, 700)).toBe(0);
    });

    it('returns 0 when distance is more than 150', () => {
      expect(service.getDiscount('OFR002', 100, 151, 700)).toBe(0);
    });

    it('returns 0 when weight is less than 100', () => {
      expect(service.getDiscount('OFR002', 99, 100, 700)).toBe(0);
    });

    it('returns 0 when weight is more than 250', () => {
      expect(service.getDiscount('OFR002', 251, 100, 700)).toBe(0);
    });
  });

  describe('OFR003 - 5% discount distance 50-250 weight 10-150', () => {
    it('returns 5% discount when criteria met', () => {
      expect(service.getDiscount('OFR003', 10, 100, 700)).toBe(35);
    });

    it('returns 0 when distance is less than 50', () => {
      expect(service.getDiscount('OFR003', 10, 49, 700)).toBe(0);
    });

    it('returns 0 when distance is more than 250', () => {
      expect(service.getDiscount('OFR003', 10, 251, 700)).toBe(0);
    });

    it('returns 0 when weight is less than 10', () => {
      expect(service.getDiscount('OFR003', 9, 100, 700)).toBe(0);
    });

    it('returns 0 when weight is more than 150', () => {
      expect(service.getDiscount('OFR003', 151, 100, 700)).toBe(0);
    });
  });
});
