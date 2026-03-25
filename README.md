# Kiki's Courier Service

A command line application to estimate delivery costs and times
for Kiki's courier service in the city of Koriko.

---

## Installation

### Prerequisites

- Node.js (>= 22.13.0)
- npm (comes with Node.js)

### Setup

```bash
git clone https://github.com/PatriotWolf/kiki-courier-cla-service.git
cd kiki-courier-cla-service
npm install
```

### Build and Link

```bash
npm run build
npm link
```

---

## Running the Application

### As a global command (after npm link)

```bash
# help
kiki-courier --help

# version
kiki-courier --version

# problem 01
printf "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003" | kiki-courier --problem 1

# problem 02
printf "100 5\nPKG1 50 30 OFR001\nPKG2 75 125 OFR008\nPKG3 175 100 OFR003\nPKG4 110 60 OFR002\nPKG5 155 95 NA\n2 70 200" | kiki-courier --problem 2

# with debug logs
printf "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003" | kiki-courier --problem 1 --debug
```

### Via npm start (development)

```bash
# problem 01
printf "100 3\nPKG1 5 5 OFR001\nPKG2 15 5 OFR002\nPKG3 10 100 OFR003" | npm start -- --problem 1

# problem 02
printf "100 5\nPKG1 50 30 OFR001\nPKG2 75 125 OFR008\nPKG3 175 100 OFR003\nPKG4 110 60 OFR002\nPKG5 155 95 NA\n2 70 200" | npm start -- --problem 2
```

### Expected Output

**Problem 01**

```
PKG1 0 175
PKG2 0 275
PKG3 35 665
```

**Problem 02**

```
PKG1 0 750 3.98
PKG2 0 1475 1.78
PKG3 0 2350 1.42
PKG4 105 1395 0.85
PKG5 0 2125 4.19
```

---

## Testing

```bash
npm test                  # run all tests
npm run test:watch        # watch mode during development
npm run test:coverage     # coverage report
npm run test:ci           # ci mode with coverage
```

---

## Logging

Logs are written to `logs/combined.log` and `logs/error.log`.

```bash
# enable debug logs via flag
kiki-courier --problem 1 --debug

# enable debug logs via environment variable
LOG_LEVEL=debug npm start -- --problem 1

# view combined logs
cat logs/combined.log

# view error logs
cat logs/error.log
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
  shared/          → models, interfaces, utils, errors, logger
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

- **Structured logging with Winston**
  All key operations are logged with structured metadata.
  Log level controllable via --debug flag or LOG_LEVEL env var.
  Silent during test runs via NODE_ENV=test.

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

- **Observability is production-ready for a CLI scope**
  Winston logger provides structured logging with file and
  console transports. For a distributed system introduce
  centralized log aggregation and request-level correlation
  identifiers.

---

## AI Tool Disclosure

See DISCLOSURE.md
