export class VehicleNotFoundError extends Error {
  constructor(plateNumber: string) {
    super(`Vehicle with plate number "${plateNumber}" not found`);
    this.name = "VehicleNotFoundError";
  }
}

export class VehicleAlreadyParkedAtLocationError extends Error {
  constructor(plateNumber: string) {
    super(`Vehicle "${plateNumber}" is already parked at this location`);
    this.name = "VehicleAlreadyParkedAtLocationError";
  }
}
