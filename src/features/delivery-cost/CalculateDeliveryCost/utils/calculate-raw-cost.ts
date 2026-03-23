import {
  DISTANCE_MULTIPLIER,
  WEIGHT_MULTIPLIER,
} from '../../../../shared/constants';

export const calculateRawCost = (
  baseCost: number,
  weight: number,
  distance: number,
): number => {
  return baseCost + weight * WEIGHT_MULTIPLIER + distance * DISTANCE_MULTIPLIER;
};
