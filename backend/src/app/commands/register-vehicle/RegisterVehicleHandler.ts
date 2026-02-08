import { FleetNotFoundError } from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import { Vehicle } from "../../../domain/fleet/Vehicle.js";
import type { RegisterVehicle } from "./RegisterVehicle.js";

export class RegisterVehicleHandler {
  constructor(private fleetRepository: FleetRepository) { }

  async handle(command: RegisterVehicle): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) {
      throw new FleetNotFoundError(command.fleetId);
    }

    const vehicle = new Vehicle(command.vehiclePlateNumber);
    fleet.registerVehicle(vehicle);
    await this.fleetRepository.save(fleet);
  }
}
