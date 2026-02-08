export class VehicleAlreadyRegisteredError extends Error {
  constructor(plateNumber: string, fleetId: string) {
    super(
      `Vehicle ${plateNumber} has already been registered into fleet ${fleetId}`
    );
    this.name = "VehicleAlreadyRegisteredError";
  }
}

export class VehicleNotRegisteredInFleetError extends Error {
  constructor(plateNumber: string, fleetId: string) {
    super(`Vehicle ${plateNumber} is not registered in fleet ${fleetId}`);
    this.name = "VehicleNotRegisteredInFleetError";
  }
}

export class FleetNotFoundError extends Error {
  constructor(fleetId: string) {
    super(`Fleet ${fleetId} not found`);
    this.name = "FleetNotFoundError";
  }
}
