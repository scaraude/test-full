# Test Full

## Quick Start

```bash
pnpm install
```

### Algo

```bash
pnpm algo <N>
```

where N is a positive integer

See [algo/README.md](algo/README.md) for details.

### Backend

```bash
./fleet create <userId>
./fleet register-vehicle <fleetId> <plateNumber>
./fleet localize-vehicle <plateNumber> <lat> <lng> [alt]
```

```bash
pnpm test:backend          # Run tests (in-memory)
pnpm test:backend:sqlite   # Run critical tests (SQLite)
```

See [backend/README.md](backend/README.md) for details.
