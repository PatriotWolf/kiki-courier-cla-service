describe('DeliveryScheduler', () => {
  describe('vehicle pool', () => {
    it.todo('creates correct number of vehicles');
    it.todo('all vehicles start with availableAt zero');
  });

  describe('vehicle return time', () => {
    it.todo('vehicle return time is double the max distance divided by speed');
  });

  describe('vehicle availableAt carries forward', () => {
    it.todo('vehicle availableAt uses its own time not zero');
  });

  describe('earliest vehicle selection', () => {
    it.todo('assigns shipment to earliest available vehicle');
  });

  describe('delivery time calculation', () => {
    it.todo(
      'delivery time is vehicle availableAt plus distance divided by speed',
    );
    it.todo('truncates to 2 decimal places not rounds');
    it.todo('3.456 becomes 3.45 not 3.46');
    it.todo('1.789 becomes 1.78 not 1.79');
  });

  describe('full sample output', () => {
    it.todo('PKG1 50kg 30km returns delivery time 3.98');
    it.todo('PKG2 75kg 125km returns delivery time 1.78');
    it.todo('PKG3 175kg 100km returns delivery time 1.42');
    it.todo('PKG4 110kg 60km returns delivery time 0.85');
    it.todo('PKG5 155kg 95km returns delivery time 4.19');
  });
});
