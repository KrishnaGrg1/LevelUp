export const DEFAULT_MAX_LEVEL = 100;
export const BASE_XP = 100;
export const GROWTH_RATE = 1.15;

export interface LevelComputationResult {
  level: number;
  xpForNext: number;
  xpIntoLevel: number;
  xpNeeded: number;
  maxLevelReached: boolean;
  totalXp: number;
}

/**
 * Compute leveling progress using an exponential XP curve.
 * Mirrors backend helper computeLevelFromXp (base 100 XP, 15% growth, max level 100).
 */
export function computeLevelFromXp(
  totalXp: number = 0,
  maxLevel: number = DEFAULT_MAX_LEVEL,
  baseXp: number = BASE_XP,
  growthRate: number = GROWTH_RATE,
): LevelComputationResult {
  const normalizedXp = Math.max(0, Math.floor(totalXp));
  let level = 1;
  let xpForNext = Math.round(baseXp);
  let remainingXp = normalizedXp;

  while (level < maxLevel && remainingXp >= xpForNext) {
    remainingXp -= xpForNext;
    level += 1;
    xpForNext = Math.round(xpForNext * growthRate);
  }

  const maxLevelReached = level >= maxLevel;
  const xpIntoLevel = maxLevelReached ? 0 : remainingXp;
  const xpNeeded = maxLevelReached ? 0 : Math.max(0, xpForNext - xpIntoLevel);

  return {
    level,
    xpForNext: maxLevelReached ? 0 : xpForNext,
    xpIntoLevel,
    xpNeeded,
    maxLevelReached,
    totalXp: normalizedXp,
  };
}
