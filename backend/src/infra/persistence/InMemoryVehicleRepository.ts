import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../domain/vehicle/VehicleRepository.js";

export class InMemoryVehicleRepository implements VehicleRepository {
  private vehicles: Map<string, Vehicle> = new Map();

  async save(vehicle: Vehicle): Promise<void> {
    this.vehicles.set(vehicle.plateNumber, vehicle);
  }

  async findByPlateNumber(plateNumber: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(plateNumber);
  }

  async findByPlateNumbers(plateNumbers: string[]): Promise<Vehicle[]> {
    return plateNumbers
      .map((pn) => this.vehicles.get(pn))
      .filter((v): v is Vehicle => v !== undefined);
  }
}
