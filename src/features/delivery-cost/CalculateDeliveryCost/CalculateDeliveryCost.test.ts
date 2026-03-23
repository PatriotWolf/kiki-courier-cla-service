describe('CalculateDeliveryCost', () => {
  describe('given base cost and single package', () => {
    it.todo(
      'PKG1 5kg 5km OFR001 criteria not met returns discount 0 total 175',
    );
    it.todo(
      'PKG2 15kg 5km OFR002 criteria not met returns discount 0 total 275',
    );
    it.todo(
      'PKG3 10kg 100km OFR003 criteria met returns discount 35 total 665',
    );
  });

  describe('given base cost and multiple packages', () => {
    it.todo('calculates each package independently');
  });

  describe('when offer code is not valid', () => {
    it.todo('returns discount 0 when offer code is NA');
    it.todo('returns discount 0 when offer code does not exist');
  });
});
