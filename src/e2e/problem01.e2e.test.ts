import { CalculateDeliveryCost } from '../features/delivery-cost/CalculateDeliveryCost';
import { InMemoryOfferRepository } from '../features/delivery-cost/repositories/InMemoryOfferRepository/InMemoryOfferRepository';
import { OfferService } from '../features/delivery-cost/services/OfferService';
import { CostFormatter } from '../infrastructure/formatters/CostFormatter';
import { StdinParser } from '../infrastructure/parsers/StdinParser/StdinParser';

const runProblem01 = (lines: string[]): string[] => {
  const parser = new StdinParser();
  const formatter = new CostFormatter();
  const offerRepo = new InMemoryOfferRepository();
  const offerService = new OfferService(offerRepo);
  const useCase = new CalculateDeliveryCost(offerService);

  const { baseCost, packages } = parser.parse(lines);
  const results = useCase.execute(baseCost, packages);
  return formatter.formatCosts(results);
};

describe('Problem 01 - Delivery Cost Estimation with Offers', () => {
  describe('only one offer code can be applied per package', () => {
    it('PKG1 with OFR001 applies only one discount', () => {
      const output = runProblem01(['100 1', 'PKG1 5 5 OFR001']);
      expect(output[0]).toBe('PKG1 0 175');
    });

    it('PKG2 with OFR002 applies only one discount', () => {
      const output = runProblem01(['100 1', 'PKG2 15 5 OFR002']);
      expect(output[0]).toBe('PKG2 0 275');
    });

    it('PKG3 with OFR003 applies only one discount', () => {
      const output = runProblem01(['100 1', 'PKG3 10 100 OFR003']);
      expect(output[0]).toBe('PKG3 35 665');
    });
  });

  describe('OFR001 - 10% discount distance < 200 weight 70-200', () => {
    it('applies 10% discount when distance less than 200 and weight between 70 and 200', () => {
      const output = runProblem01(['100 1', 'PKG1 100 100 OFR001']);
      expect(output[0]).toBe('PKG1 160 1440');
    });

    it('returns discount 0 when distance is 200 or more', () => {
      const output = runProblem01(['100 1', 'PKG1 100 200 OFR001']);
      expect(output[0]).toBe('PKG1 0 2100');
    });

    it('returns discount 0 when weight is less than 70', () => {
      const output = runProblem01(['100 1', 'PKG1 69 100 OFR001']);
      expect(output[0]).toBe('PKG1 0 1290');
    });

    it('returns discount 0 when weight is more than 200', () => {
      const output = runProblem01(['100 1', 'PKG1 201 100 OFR001']);
      expect(output[0]).toBe('PKG1 0 2610');
    });
  });

  describe('OFR002 - 7% discount distance 50-150 weight 100-250', () => {
    it('applies 7% discount when distance between 50 and 150 and weight between 100 and 250', () => {
      const output = runProblem01(['100 1', 'PKG1 100 100 OFR002']);
      expect(output[0]).toBe('PKG1 112 1488');
    });

    it('returns discount 0 when distance is less than 50', () => {
      const output = runProblem01(['100 1', 'PKG1 100 49 OFR002']);
      expect(output[0]).toBe('PKG1 0 1345');
    });

    it('returns discount 0 when distance is more than 150', () => {
      const output = runProblem01(['100 1', 'PKG1 100 151 OFR002']);
      expect(output[0]).toBe('PKG1 0 1855');
    });

    it('returns discount 0 when weight is less than 100', () => {
      const output = runProblem01(['100 1', 'PKG1 99 100 OFR002']);
      expect(output[0]).toBe('PKG1 0 1590');
    });

    it('returns discount 0 when weight is more than 250', () => {
      const output = runProblem01(['100 1', 'PKG1 251 100 OFR002']);
      expect(output[0]).toBe('PKG1 0 3110');
    });
  });

  describe('OFR003 - 5% discount distance 50-250 weight 10-150', () => {
    it('applies 5% discount when distance between 50 and 250 and weight between 10 and 150', () => {
      const output = runProblem01(['100 1', 'PKG3 10 100 OFR003']);
      expect(output[0]).toBe('PKG3 35 665');
    });

    it('returns discount 0 when distance is less than 50', () => {
      const output = runProblem01(['100 1', 'PKG3 10 49 OFR003']);
      expect(output[0]).toBe('PKG3 0 445');
    });

    it('returns discount 0 when distance is more than 250', () => {
      const output = runProblem01(['100 1', 'PKG3 10 251 OFR003']);
      expect(output[0]).toBe('PKG3 0 1455');
    });

    it('returns discount 0 when weight is less than 10', () => {
      const output = runProblem01(['100 1', 'PKG3 9 100 OFR003']);
      expect(output[0]).toBe('PKG3 0 690');
    });

    it('returns discount 0 when weight is more than 150', () => {
      const output = runProblem01(['100 1', 'PKG3 151 100 OFR003']);
      expect(output[0]).toBe('PKG3 0 2110');
    });
  });

  describe('when offer code is not valid or not found', () => {
    it('returns discount 0 when no offer code provided', () => {
      const output = runProblem01(['100 1', 'PKG1 10 100']);
      expect(output[0]).toBe('PKG1 0 700');
    });

    it('returns discount 0 when offer code is NA', () => {
      const output = runProblem01(['100 1', 'PKG1 10 100 NA']);
      expect(output[0]).toBe('PKG1 0 700');
    });

    it('returns discount 0 when offer code does not exist', () => {
      const output = runProblem01(['100 1', 'PKG1 10 100 INVALID']);
      expect(output[0]).toBe('PKG1 0 700');
    });
  });

  describe('full system input to output', () => {
    it('full sample input produces exact expected output line by line', () => {
      const input = [
        '100 3',
        'PKG1 5 5 OFR001',
        'PKG2 15 5 OFR002',
        'PKG3 10 100 OFR003',
      ];
      const output = runProblem01(input);
      expect(output).toEqual(['PKG1 0 175', 'PKG2 0 275', 'PKG3 35 665']);
    });
  });
});
