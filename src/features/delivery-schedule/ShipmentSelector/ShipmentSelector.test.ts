import { Package } from '../../../shared/models/Package/Package';
import { ShipmentSelector } from './ShipmentSelector';

describe('ShipmentSelector', () => {
  let selector: ShipmentSelector;

  beforeEach(() => {
    selector = new ShipmentSelector();
  });

  describe('maximum packages selection', () => {
    it('selects maximum number of packages within weight limit', () => {
      const packages = [
        new Package('PKG1', 50, 30),
        new Package('PKG2', 75, 125),
        new Package('PKG3', 175, 100),
        new Package('PKG4', 110, 60),
        new Package('PKG5', 155, 95),
      ];
      const result = selector.select(packages, 200);
      expect(result.length).toBe(2);
    });

    it('selects single package when only one fits', () => {
      const packages = [
        new Package('PKG1', 190, 30),
        new Package('PKG2', 180, 125),
      ];
      const result = selector.select(packages, 200);
      expect(result.length).toBe(1);
    });

    it('selects all packages when total weight within limit', () => {
      const packages = [
        new Package('PKG1', 50, 30),
        new Package('PKG2', 50, 125),
        new Package('PKG3', 50, 100),
      ];
      const result = selector.select(packages, 200);
      expect(result.length).toBe(3);
    });

    it('returns empty when no packages provided', () => {
      const result = selector.select([], 200);
      expect(result).toEqual([]);
    });
  });

  describe('weight tiebreaker', () => {
    it('prefers heavier combination when package count is equal', () => {
      const packages = [
        new Package('PKG1', 50, 30),
        new Package('PKG2', 75, 125),
        new Package('PKG4', 110, 60),
      ];
      // PKG1+PKG2 = 125kg vs PKG1+PKG4 = 160kg vs PKG2+PKG4 = 185kg
      const result = selector.select(packages, 200);
      expect(result.map((p) => p.id)).toEqual(
        expect.arrayContaining(['PKG2', 'PKG4']),
      );
    });
  });

  describe('distance tiebreaker', () => {
    it('prefers smallest max distance when count and weight are equal', () => {
      const packages = [
        new Package('PKG1', 100, 10),
        new Package('PKG2', 100, 50),
        new Package('PKG3', 100, 30),
      ];
      // all single packages same weight
      // PKG1 max distance 10 wins
      const result = selector.select(packages, 100);
      expect(result[0].id).toBe('PKG1');
    });
  });

  describe('edge cases', () => {
    it('handles single package exactly at weight limit', () => {
      const packages = [new Package('PKG1', 200, 30)];
      const result = selector.select(packages, 200);
      expect(result[0].id).toBe('PKG1');
    });

    it('handles all packages exceeding weight limit individually', () => {
      const packages = [
        new Package('PKG1', 300, 30),
        new Package('PKG2', 400, 50),
      ];
      const result = selector.select(packages, 200);
      expect(result).toEqual([]);
    });

    it('handles two packages with same weight and distance', () => {
      const packages = [
        new Package('PKG1', 100, 50),
        new Package('PKG2', 100, 50),
      ];
      const result = selector.select(packages, 200);
      expect(result.length).toBe(2);
    });
  });
});
