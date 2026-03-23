describe('OfferService', () => {
  beforeEach(() => {});

  describe('when offer code is not valid or not found', () => {
    it.todo('returns 0 when offer code is undefined');
    it.todo('returns 0 when offer code is NA');
    it.todo('returns 0 when offer code does not exist');
  });

  describe('OFR001 - 10% discount distance < 200 weight 70-200', () => {
    it.todo('returns 10% discount when criteria met');
    it.todo('returns 0 when distance is 200 or more');
    it.todo('returns 0 when weight is less than 70');
    it.todo('returns 0 when weight is more than 200');
  });

  describe('OFR002 - 7% discount distance 50-150 weight 100-250', () => {
    it.todo('returns 7% discount when criteria met');
    it.todo('returns 0 when distance is less than 50');
    it.todo('returns 0 when distance is more than 150');
    it.todo('returns 0 when weight is less than 100');
    it.todo('returns 0 when weight is more than 250');
  });

  describe('OFR003 - 5% discount distance 50-250 weight 10-150', () => {
    it.todo('returns 5% discount when criteria met');
    it.todo('returns 0 when distance is less than 50');
    it.todo('returns 0 when distance is more than 250');
    it.todo('returns 0 when weight is less than 10');
    it.todo('returns 0 when weight is more than 150');
  });
});
