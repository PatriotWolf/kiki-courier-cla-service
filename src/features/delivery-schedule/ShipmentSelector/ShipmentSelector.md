# ShipmentSelector

## Problem

Given N packages and a weight limit, find the best combination
for a single vehicle trip.

Selection criteria in order of priority:

```
1. Maximum number of packages that fit within weight limit
2. Heaviest total weight if package count is equal
3. Smallest max distance if weight is also equal
```

---

## Example

```
Packages available:

PKG1  50kg   30km
PKG2  75kg  125km
PKG3 175kg  100km
PKG4 110kg   60km
PKG5 155kg   95km

Max weight: 200kg
```

Finding all valid 2-package combinations:

```
PKG1 + PKG2 = 125kg  ✅
PKG1 + PKG3 = 225kg  ❌ over limit
PKG1 + PKG4 = 160kg  ✅
PKG1 + PKG5 = 205kg  ❌ over limit
PKG2 + PKG3 = 250kg  ❌ over limit
PKG2 + PKG4 = 185kg  ✅  ← heaviest valid 2-package combo
PKG2 + PKG5 = 230kg  ❌ over limit
PKG3 + PKG4 = 285kg  ❌ over limit
PKG3 + PKG5 = 330kg  ❌ over limit
PKG4 + PKG5 = 265kg  ❌ over limit
```

No valid 3-package combinations exist.
Winner: PKG2 + PKG4 = 185kg (heaviest 2-package combo)

---

## Approach — Bitmask Enumeration

Every combination is represented as a binary number.
Each bit position maps to one package.

```
Position:  PKG5  PKG4  PKG3  PKG2  PKG1
Bit:          4     3     2     1     0

mask = 00001 →  PKG1 only
mask = 00010 →  PKG2 only
mask = 00011 →  PKG1 + PKG2
mask = 00100 →  PKG3 only
mask = 00101 →  PKG1 + PKG3
mask = 00110 →  PKG2 + PKG3
mask = 00111 →  PKG1 + PKG2 + PKG3
mask = 01010 →  PKG2 + PKG4
mask = 11111 →  all packages
```

For N=5 packages we loop mask from 1 to 31 (2^5 - 1).
Each mask is one combination to evaluate.

---

## How a Bit Is Checked

```
Is PKG3 in mask 00101?

mask     = 0 0 1 0 1
1 << 2   = 0 0 1 0 0   (PKG3 is at position 2)
─────────────────────
AND      = 0 0 1 0 0   result is non-zero → PKG3 is included

Is PKG2 in mask 00101?

mask     = 0 0 1 0 1
1 << 1   = 0 0 0 1 0   (PKG2 is at position 1)
─────────────────────
AND      = 0 0 0 0 0   result is zero → PKG2 is not included
```

---

## Selection Flow

```
for each mask from 1 to 2^N - 1
  │
  ├── build combo from bits
  │     PKG included if (mask & 1<<i) != 0
  │
  ├── calculate total weight
  │     if over limit → skip ❌
  │
  ├── compare against current best
  │     more packages?        → new best ✅
  │     same count, heavier?  → new best ✅
  │     same count, same weight,
  │     smaller max distance? → new best ✅
  │     otherwise             → keep current best
  │
  └── repeat until all masks exhausted

return best combo
```

---

## Scoring Logic

```
Current best:  PKG1+PKG2  count=2  weight=125kg  maxDist=125km
New candidate: PKG2+PKG4  count=2  weight=185kg  maxDist=125km

count equal?   2 == 2  → yes, check weight
weight higher? 185 > 125 → yes

New best: PKG2+PKG4 ✅
```

```
Current best:  PKG2+PKG4  count=2  weight=185kg  maxDist=125km
New candidate: PKG1+PKG4  count=2  weight=160kg  maxDist=60km

count equal?   2 == 2  → yes, check weight
weight higher? 160 > 185 → no

Keep current best: PKG2+PKG4 ✅
```

---

## Complexity

```
N = number of packages

Time:  O(2^N × N)
         │       └── check each bit per mask
         └── total number of masks

Space: O(N) — store current combo only


N=5   →    32 combinations  fast ✅
N=10  →  1024 combinations  fine ✅
N=20  →  1048576 combinations  slow ⚠️
N=30  →  1073741824 combinations  too slow ❌
```

---

## Trade-off

Bitmask enumeration is correct and readable for small N.

At scale, this should be replaced with a dynamic programming
approach similar to the 0/1 knapsack problem which runs
in O(N × W) where W is the max weight.

For this problem N is small and bounded making bitmask
the right choice here.
