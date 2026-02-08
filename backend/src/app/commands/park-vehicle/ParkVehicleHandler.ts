import {
  FleetNotFoundError,
  VehicleNotRegisteredInFleetError,
} from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import { Location } from "../../../domain/shared/Location.js";
import {
  VehicleAlreadyParkedAtLocationError,
  VehicleNotFoundError,
} from "../../../domain/vehicle/errors.js";
import type { VehicleRepository } from "../../../domain/vehicle/VehicleRepository.js";
import type { ParkVehicle } from "./ParkVehicle.js";

export class ParkVehicleHandler {
  constructor(
    private fleetRepository: FleetRepository,
    private vehicleRepository: VehicleRepository
  ) {}

  async handle(command: ParkVehicle): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) {
      throw new FleetNotFoundError(command.fleetId);
    }

    if (!fleet.hasVehicle(command.vehiclePlateNumber)) {
      throw new VehicleNotRegisteredInFleetError(
        command.vehiclePlateNumber,
        command.fleetId
      );
    }

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
