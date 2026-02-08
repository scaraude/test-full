import { setWorldConstructor, World } from "@cucumber/cucumber";
import { CreateFleetHandler } from "../../src/app/commands/create-fleet/CreateFleetHandler.js";
import { ParkVehicleHandler } from "../../src/app/commands/park-vehicle/ParkVehicleHandler.js";
import { RegisterVehicleHandler } from "../../src/app/commands/register-vehicle/RegisterVehicleHandler.js";
import type { Location } from "../../src/domain/shared/Location.js";
import { InMemoryFleetRepository } from "../../src/infra/persistence/InMemoryFleetRepository.js";

export class FleetWorld extends World {
  fleetRepository = new InMemoryFleetRepository();
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
