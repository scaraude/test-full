import { FleetNotFoundError } from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import { Vehicle } from "../../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../../domain/vehicle/VehicleRepository.js";
import type { RegisterVehicle } from "./RegisterVehicle.js";

export class RegisterVehicleHandler {
  constructor(
    private fleetRepository: FleetRepository,
    private vehicleRepository: VehicleRepository
  ) {}

  async handle(command: RegisterVehicle): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) {
      throw new FleetNotFoundError(command.fleetId);
    }

    // Register plate number in fleet
    fleet.registerVehicle(command.vehiclePlateNumber);
    await this.fleetRepository.save(fleet);

    // Create vehicle if it doesn't exist yet
    const existingVehicle = await this.vehicleRepository.findByPlateNumber(
      command.vehiclePlateNumber
    );
    if (!existingVehicle) {
      const vehicle = new Vehicle(command.vehiclePlateNumber);
      await this.vehicleRepository.save(vehicle);
    }
  }
}
