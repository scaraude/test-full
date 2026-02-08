# Fleet Management Backend

## Architecture Overview

```
backend/
├── src/
│   ├── app/           # Application layer - Commands & Handlers
│   ├── domain/        # Domain layer - Business logic, entities, value objects
│   └── infra/         # Infrastructure layer - Persistence, CLI
├── features/          # BDD test specifications (Gherkin)
└── cucumber.js        # Test configuration with profiles
```

### Layered Architecture

| Layer              | Responsibility         | Contents                                                                                  |
| ------------------ | ---------------------- | ----------------------------------------------------------------------------------------- |
| **Domain**         | Core business logic    | Entities (Fleet, Vehicle), Value Objects (Location), Repository interfaces, Domain errors |
| **Application**    | Use case orchestration | Commands (CreateFleet, RegisterVehicle, ParkVehicle) and their handlers                   |
| **Infrastructure** | External concerns      | SQLite + in-memory repositories, CLI interface, database connection                       |

### Domain Model

**Entities:**

- **Fleet** - Aggregate root managing a collection of vehicles for a user
- **Vehicle** - Represents a transportation mode with a plate number and optional location

**Value Objects:**

- **Location** - Immutable GPS coordinates (latitude, longitude, optional altitude)

**Branded Types:**
TypeScript branded types provide compile-time safety preventing accidental mixing of identifiers:

```typescript
FleetId = string & { __brand: "FleetId" };
UserId = string & { __brand: "UserId" };
PlateNumber = string & { __brand: "PlateNumber" };
```

### CQRS Implementation

| Command           | Handler                  | Purpose                       |
| ----------------- | ------------------------ | ----------------------------- |
| `CreateFleet`     | `CreateFleetHandler`     | Create a new fleet for a user |
| `RegisterVehicle` | `RegisterVehicleHandler` | Add a vehicle to a fleet      |
| `ParkVehicle`     | `ParkVehicleHandler`     | Set vehicle location          |

Each command is an immutable data structure. Handlers coordinate domain operations and repository interactions.

**No queries implemented:** all CLI commands are write operations (commands).

## Technology Stack

| Category           | Technology              | Version |
| ------------------ | ----------------------- | ------- |
| Runtime            | Node.js                 | 22      |
| Language           | TypeScript              | 5.9     |
| Database           | SQLite (better-sqlite3) | -       |
| CLI Framework      | Commander.js            | 14.x    |
| Testing            | Cucumber.js (BDD)       | 12.x    |
| Linting/Formatting | Biome                   | 2.x     |
| Package Manager    | pnpm                    | 10.x    |

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm

### Installation

```bash
pnpm install
```

### CLI Usage

```bash
# Create a new fleet (returns fleetId)
./fleet create <userId>

# Register a vehicle to a fleet
./fleet register-vehicle <fleetId> <vehiclePlateNumber>

# Park a vehicle at a location
./fleet localize-vehicle <vehiclePlateNumber> <lat> <lng> [alt]
```

### Running Tests

```bash
# Run all BDD tests with in-memory repositories (fast)
pnpm test:backend

# Run only @critical tests with SQLite persistence
pnpm test:backend:sqlite
```

The test strategy uses Cucumber profiles:

- **Default profile**: All scenarios run with in-memory repositories (fast, no I/O)
- **SQLite profile**: Only `@critical` tagged scenarios run with real SQLite (validates persistence)

## Tech Decisions & Rationale

### Why SQLite?

- **Lightweight** - No external database server required
- **File-based** - Easy deployment and backup
- **Zero configuration** - Works out of the box
- **Sufficient for scope** - Fleet management doesn't require distributed database features

### Why Branded Types?

Prevents common bugs at compile time:

```typescript
// This won't compile - can't pass UserId where FleetId expected
const fleet = await fleetRepo.findById(userId); // Error!
```

### Why Biome over ESLint/Prettier?

- **Speed** - Written in Rust, significantly faster than ESLint
- **Unified tooling** - Linting + formatting in one tool
- **Zero config** - Sensible defaults, minimal configuration needed
- **Modern** - Built for current JavaScript/TypeScript practices

## Code Quality

### Tools Used

1. **Biome** - Fast linter and formatter
   - Catches code smells and potential bugs
   - Enforces consistent code style
   - Replaces ESLint + Prettier with single tool

2. **TypeScript Strict Mode** - Maximum type safety
   - `strict: true` - All strict checks enabled
   - `noUncheckedIndexedAccess` - Safe array/object access
   - `isolatedModules` - Better module compilation

3. **Branded Types** - Domain-level type safety
   - Prevents mixing different ID types
   - Compile-time guarantees

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/backend.yml`) runs on every push/PR:

| Job           | Purpose                                                     |
| ------------- | ----------------------------------------------------------- |
| **lint**      | Runs `biome check` - validates formatting and linting rules |
| **typecheck** | Runs `tsc --noEmit` - ensures type correctness              |
| **test**      | Runs Cucumber BDD tests - validates behavior                |

All jobs run in parallel on Node 22 with pnpm caching for fast execution.

```yaml
# Simplified workflow structure
jobs:
  lint: pnpm biome check
  typecheck: pnpm tsc --noEmit
  test: pnpm test
```

## Project Structure Details

```
src/
├── app/
│   ├── create-fleet/
│   │   ├── CreateFleet.ts         # Command definition
│   │   └── CreateFleetHandler.ts  # Command handler
│   ├── register-vehicle/
│   │   ├── RegisterVehicle.ts
│   │   └── RegisterVehicleHandler.ts
│   └── park-vehicle/
│       ├── ParkVehicle.ts
│       └── ParkVehicleHandler.ts
├── domain/
│   ├── fleet/
│   │   ├── Fleet.ts               # Fleet entity
│   │   ├── FleetRepository.ts     # Repository interface
│   │   └── errors.ts              # Domain errors
│   ├── vehicle/
│   │   ├── Vehicle.ts             # Vehicle entity
│   │   ├── VehicleRepository.ts   # Repository interface
│   │   └── errors.ts              # Domain errors
│   └── shared/
│       └── Location.ts            # Location value object
└── infra/
    ├── cli/
    │   └── fleet.ts                   # Commander.js CLI
    └── persistence/
        ├── DatabaseConnection.ts      # SQLite setup
        ├── SqliteFleetRepository.ts   # SQLite fleet persistence
        ├── SqliteVehicleRepository.ts # SQLite vehicle persistence
        ├── InMemoryFleetRepository.ts # In-memory fleet (for tests)
        └── InMemoryVehicleRepository.ts # In-memory vehicle (for tests)
```

## Error Handling

Domain-specific errors with meaningful names:

- `VehicleAlreadyRegisteredError` - Vehicle already in fleet
- `VehicleNotRegisteredInFleetError` - Vehicle not found in fleet
- `FleetNotFoundError` - Fleet doesn't exist
- `VehicleNotFoundError` - Vehicle doesn't exist
- `VehicleAlreadyParkedAtLocationError` - Same location twice
