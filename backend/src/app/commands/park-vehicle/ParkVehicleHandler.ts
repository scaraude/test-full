import { Location } from "../../../domain/shared/Location.js";
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
    const vehicle = await this.vehicleRepository.findByPlateNumber(
      command.vehiclePlateNumber
    );
    if (!vehicle) {
      throw new VehicleNotFoundError(command.vehiclePlateNumber);
    }

    const location = new Location(
      command.latitude,
      command.longitude,
      command.altitude
    );

    if (vehicle.isParkedAt(location)) {
      throw new VehicleAlreadyParkedAtLocationError(command.vehiclePlateNumber);
    }

    vehicle.park(location);
    await this.vehicleRepository.save(vehicle);
  }
}
