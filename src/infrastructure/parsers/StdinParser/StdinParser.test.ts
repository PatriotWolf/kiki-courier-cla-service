import { StdinParser } from './StdinParser';
import { InvalidInputError } from '../../../shared/errors/DomainErrors';

describe('StdinParser', () => {
  let parser: StdinParser;

  beforeEach(() => {
    parser = new StdinParser();
  });

  describe('valid input', () => {
    it('parses base cost and number of packages from first line', () => {
      const result = parser.parse([
        '100 3',
        'PKG1 5 5 OFR001',
        'PKG2 15 5 OFR002',
        'PKG3 10 100 OFR003',
      ]);
      expect(result.baseCost).toBe(100);
      expect(result.packages).toHaveLength(3);
    });

    it('parses package id weight distance and offer code', () => {
      const result = parser.parse(['100 1', 'PKG1 5 5 OFR001']);
      expect(result.packages[0].id).toBe('PKG1');
      expect(result.packages[0].weight).toBe(5);
      expect(result.packages[0].distance).toBe(5);
      expect(result.packages[0].offerCode).toBe('OFR001');
    });

    it('parses NA offer code as undefined', () => {
      const result = parser.parse(['100 1', 'PKG1 5 5 NA']);
      expect(result.packages[0].offerCode).toBeUndefined();
    });

    it('parses missing offer code as undefined', () => {
      const result = parser.parse(['100 1', 'PKG1 5 5']);
      expect(result.packages[0].offerCode).toBeUndefined();
    });

    it('parses multiple packages', () => {
      const result = parser.parse([
        '100 3',
        'PKG1 5 5 OFR001',
        'PKG2 15 5 OFR002',
        'PKG3 10 100 OFR003',
      ]);
      expect(result.packages).toHaveLength(3);
      expect(result.packages[0].id).toBe('PKG1');
      expect(result.packages[1].id).toBe('PKG2');
      expect(result.packages[2].id).toBe('PKG3');
    });
  });

  describe('invalid input', () => {
    it('throws when input is empty', () => {
      expect(() => parser.parse([])).toThrow(InvalidInputError);
    });

    it('throws when first line is missing', () => {
      expect(() => parser.parse([''])).toThrow(InvalidInputError);
    });

    it('throws when package lines are missing', () => {
      expect(() => parser.parse(['100 3', 'PKG1 5 5 OFR001'])).toThrow(
        InvalidInputError,
      );
    });

    it('throws when base cost is not a number', () => {
      expect(() => parser.parse(['abc 3', 'PKG1 5 5 OFR001'])).toThrow(
        InvalidInputError,
      );
    });
  });

  describe('vehicle configuration', () => {
    it.todo('parses number of vehicles speed and max weight');
    it.todo('throws when vehicle configuration line is missing');
  });
});
