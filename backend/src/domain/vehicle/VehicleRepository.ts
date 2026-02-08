import type { Vehicle } from "./Vehicle.js";

export interface VehicleRepository {
  save(vehicle: Vehicle): Promise<void>;
  findByPlateNumber(plateNumber: string): Promise<Vehicle | undefined>;
  findByPlateNumbers(plateNumbers: string[]): Promise<Vehicle[]>;
}
