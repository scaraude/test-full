import type { Fleet } from "../../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import type { CreateFleet } from "./CreateFleet.js";

export class CreateFleetHandler {
  constructor(private fleetRepository: FleetRepository) { }

  async handle(command: CreateFleet): Promise<Fleet["id"]> {
    const fleetId = await this.fleetRepository.create(command.userId);
    return fleetId;
  }
}
