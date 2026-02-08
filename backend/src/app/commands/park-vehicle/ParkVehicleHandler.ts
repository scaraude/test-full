import {
  VehicleAlreadyParkedAtLocationError,
  VehicleNotFoundError,
} from "../../../domain/vehicle/errors.js";
import type { VehicleRepository } from "../../../domain/vehicle/VehicleRepository.js";
import type { ParkVehicle } from "./ParkVehicle.js";

export class ParkVehicleHandler {
  constructor(
    private vehicleRepository: VehicleRepository
  ) { }

  async handle(command: ParkVehicle): Promise<void> {
    const { vehiclePlateNumber, location } = command;

    const vehicle = await this.vehicleRepository.findByPlateNumber(
      vehiclePlateNumber
    );
    if (!vehicle) {
      throw new VehicleNotFoundError(vehiclePlateNumber);
    }

    if (vehicle.isParkedAt(location)) {
      throw new VehicleAlreadyParkedAtLocationError(vehiclePlateNumber);
    }

    await this.vehicleRepository.updateLocation(vehicle.plateNumber, location);
  }
}
