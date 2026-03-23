# Kiki's Courier Service

A command line application to estimate delivery costs and times
for Kiki's courier service in the city of Koriko.

---

## Installation

### Prerequisites

- Node.js (>= 18 recommended)
- npm (comes with Node.js)

### Setup

```bash
git clone https://github.com/PatriotWolf/kiki-courier-cla-service.git
cd kiki-courier-cla-service
npm install
```

## Running the Application via Command Line

```bash
# run all tests
npm test

# pipe input for problem 1, or change the input to have other desired results
echo "100 3
PKG1 5 5 OFR001
PKG2 15 5 OFR002
PKG3 10 100 OFR003" | npm start

# pipe input for problem 2, or change the input to have other desired results
echo "100 5
PKG1 50 30 OFR001
PKG2 75 125 OFR008
PKG3 175 100 OFR003
PKG4 110 60 OFR002
PKG5 155 95 NA
2 70 200" | npm start

```

---

## Architecture

Feature-sliced design with SOLID principles applied throughout.
Each feature folder owns its domain logic, interfaces,
and implementations. Infrastructure concerns are isolated
to their own layer. The CLI entry point is the only place
where concrete dependencies are wired together.

```
src/
  shared/          → models, interfaces, utils, errors
  features/
    delivery-cost/     → Problem 01 logic
    delivery-schedule/ → Problem 02 logic
  infrastructure/  → parsers, formatters
  cli/             → entry point, wires everything
  e2e/             → end to end tests
```

## Dependency Flow

```
cli/index.ts          → depends on features and infrastructure
features/             → depends on shared only
infrastructure/       → depends on shared only
shared/               → depends on nothing internal
```

Dependency always points inward.
Nothing in shared knows about features.
Nothing in features knows about infrastructure.
Nothing in features knows about cli.

---

## Design Decisions

- **Offer representation as data, not control flow**
  Promotions are modeled as composable data structures rather
  than hardcoded conditionals. This keeps the system open for
  extension without modifying core logic.
  Satisfies Open/Closed Principle.

- **Shipment selection via bitmask enumeration**
  The ShipmentSelector evaluates all combinations using a
  bitmask approach. Simple, predictable, and correct for
  small input sizes. Time complexity is explicitly documented
  as O(2^N) with clear boundaries on when this becomes
  non-viable. See ShipmentSelector.md for full explanation.

- **Fail-fast domain modeling with value objects**
  Core domain entities validate invariants at construction time.
  Invalid state cannot exist after construction. Reduces
  defensive checks downstream.

- **Interfaces before implementations**
  Every service and repository depends on an abstraction.
  IOfferRepository, IOfferService, IShipmentSelector,
  IDeliveryScheduler — all injected not instantiated.
  Satisfies Dependency Inversion Principle.

- **Truncation not rounding**
  Delivery times are floored to 2 decimal places.
  3.456 becomes 3.45 not 3.46.
  Matches challenge specification exactly.

- **Vehicle availableAt carries full precision**
  Vehicle return time is never floored mid-calculation.
  Only the final delivery time shown to the user is floored.
  Prevents precision loss compounding across trips.

---

## Trade-offs & Scalability Considerations

- **Combination strategy does not scale linearly**
  Bitmask enumeration becomes impractical as input size grows.
  For larger datasets replace with dynamic programming or
  constraint optimization. Boundary is approximately N > 20.

- **In-memory persistence is a placeholder**
  InMemoryOfferRepository is sufficient for local execution
  and testing. Should be replaced with a persistent datastore
  in a production environment. IOfferRepository interface
  makes this swap trivial without touching business logic.

- **Observability is minimal**
  Current implementation lacks structured logging and
  traceability. For production introduce centralized logging
  and request-level correlation to support auditing and
  debugging.

---
