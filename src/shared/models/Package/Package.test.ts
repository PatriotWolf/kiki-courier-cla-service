describe('Package', () => {
  describe('when id is invalid', () => {
    it.todo('throws InvalidPackageError when id is empty');
    it.todo('throws InvalidPackageError when id is whitespace');
  });

  describe('when weight is invalid', () => {
    it.todo('throws InvalidPackageError when weight is zero');
    it.todo('throws InvalidPackageError when weight is negative');
  });

  describe('when distance is invalid', () => {
    it.todo('throws InvalidPackageError when distance is zero');
    it.todo('throws InvalidPackageError when distance is negative');
  });

  describe('when all inputs are valid', () => {
    it.todo('creates package without offer code');
    it.todo('creates package with offer code');
  });
});
