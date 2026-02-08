import type { Vehicle } from "../vehicle/Vehicle.js";
import type { Fleet } from "./Fleet.js";

export class VehicleAlreadyRegisteredError extends Error {
  constructor(plateNumber: Vehicle["plateNumber"], fleetId: Fleet["id"]) {
    super(
      `Vehicle ${plateNumber} has already been registered into fleet ${fleetId}`
    );
    this.name = "VehicleAlreadyRegisteredError";
  }
}

export class VehicleNotRegisteredInFleetError extends Error {
  constructor(plateNumber: Vehicle["plateNumber"], fleetId: Fleet["id"]) {
    super(`Vehicle ${plateNumber} is not registered in fleet ${fleetId}`);
    this.name = "VehicleNotRegisteredInFleetError";
  }
}

export class FleetNotFoundError extends Error {
  constructor(fleetId: Fleet["id"]) {
    super(`Fleet ${fleetId} not found`);
    this.name = "FleetNotFoundError";
  }
}
