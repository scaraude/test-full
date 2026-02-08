import { FleetNotFoundError } from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import { Location } from "../../../domain/shared/Location.js";
import type { ParkVehicle } from "./ParkVehicle.js";

export class ParkVehicleHandler {
  constructor(private fleetRepository: FleetRepository) { }

  async handle(command: ParkVehicle): Promise<void> {
    const fleet = await this.fleetRepository.findById(command.fleetId);
    if (!fleet) {
      throw new FleetNotFoundError(command.fleetId);
    }

    const location = new Location(command.latitude, command.longitude, command.altitude);
    fleet.parkVehicle(command.vehiclePlateNumber, location);
    await this.fleetRepository.save(fleet);
  }
}
