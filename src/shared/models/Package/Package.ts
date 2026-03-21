import { InvalidPackageError } from '../../errors/DomainErrors';

export class Package {
  constructor(
    public readonly id: string,
    public readonly weight: number,
    public readonly distance: number,
    public readonly offerCode?: string,
  ) {
    if (!id || id.trim() === '') {
      throw new InvalidPackageError('Package ID cannot be empty');
    }
    if (weight <= 0) {
      throw new InvalidPackageError(`Weight must be positive, got ${weight}`);
    }
    if (distance <= 0) {
      throw new InvalidPackageError(
        `Distance must be positive, got ${distance}`,
      );
    }
  }
}
