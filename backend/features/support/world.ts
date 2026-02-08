import { existsSync, unlinkSync } from "node:fs";
import { setWorldConstructor, World } from "@cucumber/cucumber";
import { CreateFleetHandler } from "../../src/app/commands/create-fleet/CreateFleetHandler.js";
import { ParkVehicleHandler } from "../../src/app/commands/park-vehicle/ParkVehicleHandler.js";
import { RegisterVehicleHandler } from "../../src/app/commands/register-vehicle/RegisterVehicleHandler.js";
import type { FleetRepository } from "../../src/domain/fleet/FleetRepository.js";
import type { Location } from "../../src/domain/shared/Location.js";
import type { VehicleRepository } from "../../src/domain/vehicle/VehicleRepository.js";
import { DatabaseConnection } from "../../src/infra/persistence/DatabaseConnection.js";
import type { Fleet } from "../../src/domain/fleet/Fleet.js";
import type { Vehicle } from "../../src/domain/vehicle/Vehicle.js";

const TEST_DB_PATH = "test-fleet.db";

interface Repositories {
  fleetRepository: FleetRepository;
  vehicleRepository: VehicleRepository;
}

function createRepositories(): Repositories {
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
  const db = new DatabaseConnection(TEST_DB_PATH);
  return {
    fleetRepository: db.fleetRepository,
    vehicleRepository: db.vehicleRepository,
  };
}

export class FleetWorld extends World {
  private repos = createRepositories();

  fleetRepository = this.repos.fleetRepository;
  vehicleRepository = this.repos.vehicleRepository;

  createFleetHandler = new CreateFleetHandler(this.fleetRepository);
  registerVehicleHandler = new RegisterVehicleHandler(
    this.fleetRepository,
    this.vehicleRepository
  );
  parkVehicleHandler = new ParkVehicleHandler(
    this.vehicleRepository
  );

  myFleetId?: Fleet["id"];
  otherFleetId?: Fleet["id"];
  vehiclePlateNumber?: Vehicle["plateNumber"];
  location?: Location;
  error?: Error;
}

setWorldConstructor(FleetWorld);
