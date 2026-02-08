import { setWorldConstructor, World } from "@cucumber/cucumber";
import { existsSync, unlinkSync } from "node:fs";
import { CreateFleetHandler } from "../../src/app/commands/create-fleet/CreateFleetHandler.js";
import { ParkVehicleHandler } from "../../src/app/commands/park-vehicle/ParkVehicleHandler.js";
import { RegisterVehicleHandler } from "../../src/app/commands/register-vehicle/RegisterVehicleHandler.js";
import type { FleetRepository } from "../../src/domain/fleet/FleetRepository.js";
import type { Location } from "../../src/domain/shared/Location.js";
import { InMemoryFleetRepository } from "../../src/infra/persistence/InMemoryFleetRepository.js";
import { SqliteFleetRepository } from "../../src/infra/persistence/SqliteFleetRepository.js";

const TEST_DB_PATH = "test-fleet.db";

function createRepository(): FleetRepository {
  if (process.env.USE_SQLITE === "true") {
    if (existsSync(TEST_DB_PATH)) {
      unlinkSync(TEST_DB_PATH);
    }
    return new SqliteFleetRepository(TEST_DB_PATH);
  }
  return new InMemoryFleetRepository();
}

export class FleetWorld extends World {
  fleetRepository = createRepository();
  createFleetHandler = new CreateFleetHandler(this.fleetRepository);
  registerVehicleHandler = new RegisterVehicleHandler(this.fleetRepository);
  parkVehicleHandler = new ParkVehicleHandler(this.fleetRepository);

  myFleetId?: string;
  otherFleetId?: string;
  vehiclePlateNumber?: string;
  location?: Location;
  error?: Error;
}

setWorldConstructor(FleetWorld);
