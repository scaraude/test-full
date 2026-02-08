import type { Location } from "../shared/Location.js";
import {
  VehicleAlreadyParkedAtLocationError,
  VehicleAlreadyRegisteredError,
  VehicleNotFoundError,
} from "./errors.js";
import type { Vehicle } from "./Vehicle.js";

export class Fleet {
  private vehicles: Map<string, Vehicle> = new Map();

  constructor(
    public readonly id: string,
    public readonly userId: string
  ) { }

  registerVehicle(vehicle: Vehicle): void {
    if (this.vehicles.has(vehicle.plateNumber)) {
      throw new VehicleAlreadyRegisteredError(vehicle.plateNumber, this.id);
    }
    this.vehicles.set(vehicle.plateNumber, vehicle);
  }

  hasVehicle(plateNumber: string): boolean {
    return this.vehicles.has(plateNumber);
  }

  private _getVehicle(plateNumber: string): Vehicle {
    const vehicle = this.vehicles.get(plateNumber);
    if (!vehicle) {
      throw new VehicleNotFoundError(plateNumber, this.id);
    }
    return vehicle;
  }

  parkVehicle(plateNumber: string, location: Location): void {
    const vehicle = this._getVehicle(plateNumber);
    if (vehicle.isParkedAt(location)) {
      throw new VehicleAlreadyParkedAtLocationError(plateNumber);
    }
    vehicle.park(location);
  }

  getVehicleLocation(plateNumber: string): Location | undefined {
    return this._getVehicle(plateNumber).location;
  }
}
