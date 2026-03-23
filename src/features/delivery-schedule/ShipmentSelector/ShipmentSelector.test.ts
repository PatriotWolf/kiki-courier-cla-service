describe('ShipmentSelector', () => {
  describe('maximum packages selection', () => {
    it.todo('selects maximum number of packages within weight limit');
    it.todo('selects single package when only one fits');
    it.todo('selects all packages when total weight within limit');
    it.todo('returns empty when no packages provided');
  });

  describe('weight tiebreaker', () => {
    it.todo('prefers heavier combination when package count is equal');
    it.todo('prefers heaviest combo among equal count combinations');
  });

  describe('distance tiebreaker', () => {
    it.todo('prefers smallest max distance when count and weight are equal');
  });

  describe('edge cases', () => {
    it.todo('handles single package exactly at weight limit');
    it.todo('handles all packages exceeding weight limit individually');
    it.todo('handles two packages with same weight and distance');
  });
});
