describe('Problem 01 - Delivery Cost Estimation with Offers', () => {
  describe('only one offer code can be applied per package', () => {
    it.todo('PKG1 with OFR001 applies only one discount');
    it.todo('PKG2 with OFR002 applies only one discount');
    it.todo('PKG3 with OFR003 applies only one discount');
  });

  describe('package must meet offer criteria to get discount', () => {
    it.todo('PKG1 with OFR001 criteria not met returns discount 0');
    it.todo('PKG2 with OFR002 criteria not met returns discount 0');
    it.todo('PKG3 with OFR003 criteria met returns discount 35');
    it.todo(
      'package meets weight criteria but not distance returns discount 0',
    );
    it.todo(
      'package meets distance criteria but not weight returns discount 0',
    );
  });

  describe('when offer code is not valid or not found', () => {
    it.todo('package with no offer code returns discount 0');
    it.todo('package with NA offer code returns discount 0');
    it.todo('package with unknown offer code returns discount 0');
  });

  describe('full system input to output', () => {
    it.todo('full sample input produces exact expected output line by line');
  });
});
