export class InvalidPackageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPackageError';
  }
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}
