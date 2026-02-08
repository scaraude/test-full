import type { Vehicle } from "./Vehicle.js";

export class VehicleNotFoundError extends Error {
  constructor(plateNumber: Vehicle["plateNumber"]) {
    super(`Vehicle with plate number "${plateNumber}" not found`);
    this.name = "VehicleNotFoundError";
  }
}

export class VehicleAlreadyParkedAtLocationError extends Error {
  constructor(plateNumber: Vehicle["plateNumber"]) {
    super(`Vehicle "${plateNumber}" is already parked at this location`);
    this.name = "VehicleAlreadyParkedAtLocationError";
  }
}
