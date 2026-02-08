import { v4 as uuidv4 } from "uuid";
import { Fleet } from "../../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import type { CreateFleet } from "./CreateFleet.js";

export class CreateFleetHandler {
  constructor(private fleetRepository: FleetRepository) {}

  async handle(command: CreateFleet): Promise<string> {
    const fleetId = uuidv4();
    const fleet = new Fleet(fleetId, command.userId);
    await this.fleetRepository.save(fleet);
    return fleetId;
  }
}
