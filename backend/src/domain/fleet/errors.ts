export class VehicleAlreadyRegisteredError extends Error {
  constructor(plateNumber: string, fleetId: string) {
    super(
      `Vehicle ${plateNumber} has already been registered into fleet ${fleetId}`
    );
  }
}

export class VehicleAlreadyParkedAtLocationError extends Error {
  constructor(plateNumber: string) {
    super(`Vehicle ${plateNumber} is already parked at this location`);
  }
}

export class VehicleNotFoundError extends Error {
  constructor(plateNumber: string, fleetId: string) {
    super(`Vehicle ${plateNumber} not found in fleet ${fleetId}`);
  }
}

export class FleetNotFoundError extends Error {
  constructor(fleetId: string) {
    super(`Fleet ${fleetId} not found`);
  }
}
