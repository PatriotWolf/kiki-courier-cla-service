export class InvalidPackageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPackageError';
  }
}
