// NOTE: See ShipmentSelector.md for combo algorithm explanation that been used here.

import { Package } from '../../../shared/models/Package';
import { IShipmentSelector } from '../interfaces/IShipmentSelector';

export class ShipmentSelector implements IShipmentSelector {
  select(packages: Package[], maxWeight: number): Package[] {
    if (packages.length === 0) return [];

    const n = packages.length;
    let best: Package[] = [];
    let bestCount = 0;
    let bestWeight = 0;
    let bestMaxDistance = Infinity;

    for (let mask = 1; mask < 1 << n; mask++) {
      const combo = this.getCombo(packages, mask, n);
      const totalWeight = combo.reduce((sum, p) => sum + p.weight, 0);

      if (totalWeight > maxWeight) continue;

      const maxDistance = Math.max(...combo.map((p) => p.distance));
      const isBetter = this.isBetterCombo(
        combo.length,
        totalWeight,
        maxDistance,
        bestCount,
        bestWeight,
        bestMaxDistance,
      );

      if (isBetter) {
        best = combo;
        bestCount = combo.length;
        bestWeight = totalWeight;
        bestMaxDistance = maxDistance;
      }
    }

    return best;
  }

  private getCombo(packages: Package[], mask: number, n: number): Package[] {
    const combo: Package[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        combo.push(packages[i]);
      }
    }
    return combo;
  }

  private isBetterCombo(
    count: number,
    weight: number,
    maxDistance: number,
    bestCount: number,
    bestWeight: number,
    bestMaxDistance: number,
  ): boolean {
    if (count > bestCount) return true;
    if (count === bestCount && weight > bestWeight) return true;
    if (
      count === bestCount &&
      weight === bestWeight &&
      maxDistance < bestMaxDistance
    )
      return true;
    return false;
  }
}
