import { Package } from './Package';
import { InvalidPackageError } from '../../errors/DomainErrors';
describe('Package', () => {
  describe('when id is invalid', () => {
    it('throws InvalidPackageError when id is empty', () => {
      expect(() => new Package('', 10, 50)).toThrow(InvalidPackageError);
    });

    it('throws InvalidPackageError when id is whitespace', () => {
      expect(() => new Package('   ', 10, 50)).toThrow(InvalidPackageError);
    });
  });

  describe('when weight is invalid', () => {
    it('throws InvalidPackageError when weight is zero', () => {
      expect(() => new Package('PKG1', 0, 50)).toThrow(InvalidPackageError);
    });
    it('throws InvalidPackageError when weight is negative', () => {
      expect(() => new Package('PKG1', -1, 50)).toThrow(InvalidPackageError);
    });
  });

  describe('when distance is invalid', () => {
    it('throws InvalidPackageError when distance is zero', () => {
      expect(() => new Package('PKG1', 10, 0)).toThrow(InvalidPackageError);
    });
    it('throws InvalidPackageError when distance is negative', () => {
      expect(() => new Package('PKG1', 10, -1)).toThrow(InvalidPackageError);
    });
  });

  describe('when all inputs are valid', () => {
    it('creates package without offer code', () => {
      const pkg = new Package('PKG1', 10, 50);
      expect(pkg.id).toBe('PKG1');
      expect(pkg.weight).toBe(10);
      expect(pkg.distance).toBe(50);
      expect(pkg.offerCode).toBeUndefined();
    });

    it('creates package with offer code', () => {
      const pkg = new Package('PKG1', 10, 50, 'OFR001');
      expect(pkg.offerCode).toBe('OFR001');
    });
  });
});
