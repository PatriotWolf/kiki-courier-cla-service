describe('StdinParser', () => {
  describe('valid input', () => {
    it.todo('parses base cost and number of packages from first line');
    it.todo('parses package id weight distance and offer code');
    it.todo('parses NA offer code as undefined');
    it.todo('parses missing offer code as undefined');
    it.todo('parses multiple packages');
  });

  describe('invalid input', () => {
    it.todo('throws when input is empty');
    it.todo('throws when first line is missing');
    it.todo('throws when package lines are missing');
    it.todo('throws when base cost is not a number');
  });
});
