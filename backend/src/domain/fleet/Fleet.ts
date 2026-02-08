import { VehicleAlreadyRegisteredError } from "./errors.js";

export class Fleet {
  private vehiclePlateNumbers: Set<string> = new Set();

  constructor(
    public readonly id: string,
    public readonly userId: string,
    vehiclePlateNumbers: string[] = []
  ) {
    this.vehiclePlateNumbers = new Set(vehiclePlateNumbers);
  }

  registerVehicle(plateNumber: string): void {
    if (this.vehiclePlateNumbers.has(plateNumber)) {
      throw new VehicleAlreadyRegisteredError(plateNumber, this.id);
    }
    this.vehiclePlateNumbers.add(plateNumber);
  }

  hasVehicle(plateNumber: string): boolean {
    return this.vehiclePlateNumbers.has(plateNumber);
  }

  getVehiclePlateNumbers(): string[] {
    return [...this.vehiclePlateNumbers];
  }
}
