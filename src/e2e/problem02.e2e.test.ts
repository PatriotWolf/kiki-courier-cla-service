describe('Problem 02 - Delivery Time Estimation', () => {
  describe('vehicle constraints', () => {
    it.todo('each vehicle has a maximum weight limit');
    it.todo('all vehicles travel at the same speed');
  });

  describe('shipment selection', () => {
    it.todo('shipment contains maximum packages vehicle can carry');
    it.todo('prefers heavier combination when package count is equal');
    it.todo('prefers earliest deliverable when weight is also equal');
  });

  describe('vehicle scheduling', () => {
    it.todo('vehicle returns to source after delivery at same speed');
    it.todo('vehicle availableAt carries forward not reset to zero');
    it.todo('earliest available vehicle gets next shipment');
  });

  describe('delivery time calculation', () => {
    it.todo('delivery time is truncated to 2 decimal places not rounded');
    it.todo('3.456 becomes 3.45 not 3.46');
    it.todo('1.789 becomes 1.78 not 1.79');
  });

  describe('full system input to output', () => {
    it.todo('PKG1 50kg 30km returns discount 0 total 750 delivery time 3.98');
    it.todo('PKG2 75kg 125km returns discount 0 total 1475 delivery time 1.78');
    it.todo(
      'PKG3 175kg 100km returns discount 0 total 2350 delivery time 1.42',
    );
    it.todo(
      'PKG4 110kg 60km returns discount 105 total 1395 delivery time 0.85',
    );
    it.todo('PKG5 155kg 95km returns discount 0 total 2125 delivery time 4.19');
    it.todo('full sample input produces exact expected output line by line');
  });
});
