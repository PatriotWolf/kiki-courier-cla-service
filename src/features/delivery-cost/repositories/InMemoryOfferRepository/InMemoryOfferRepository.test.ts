import { InMemoryOfferRepository } from './InMemoryOfferRepository';

describe('InMemoryOfferRepository', () => {
  let repo: InMemoryOfferRepository;

  beforeEach(() => {
    repo = new InMemoryOfferRepository();
  });

  describe('findByCode', () => {
    it('returns OFR001 with 10% discount', () => {
      const offer = repo.findByCode('OFR001');
      expect(offer).toBeDefined();
      expect(offer?.code).toBe('OFR001');
      expect(offer?.discountPercent).toBe(10);
      expect(offer?.minDistance).toBe(0);
      expect(offer?.maxDistance).toBe(199);
      expect(offer?.minWeight).toBe(70);
      expect(offer?.maxWeight).toBe(200);
    });

    it('returns OFR002 with 7% discount', () => {
      const offer = repo.findByCode('OFR002');
      expect(offer).toBeDefined();
      expect(offer?.code).toBe('OFR002');
      expect(offer?.discountPercent).toBe(7);
      expect(offer?.minDistance).toBe(50);
      expect(offer?.maxDistance).toBe(150);
      expect(offer?.minWeight).toBe(100);
      expect(offer?.maxWeight).toBe(250);
    });

    it('returns OFR003 with 5% discount', () => {
      const offer = repo.findByCode('OFR003');
      expect(offer).toBeDefined();
      expect(offer?.code).toBe('OFR003');
      expect(offer?.discountPercent).toBe(5);
      expect(offer?.minDistance).toBe(50);
      expect(offer?.maxDistance).toBe(250);
      expect(offer?.minWeight).toBe(10);
      expect(offer?.maxWeight).toBe(150);
    });

    it('returns undefined for unknown code', () => {
      expect(repo.findByCode('UNKNOWN')).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      expect(repo.findByCode('')).toBeUndefined();
    });
  });
});
