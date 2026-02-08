import type { Fleet } from "../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../domain/fleet/FleetRepository.js";

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Map<string, Fleet> = new Map();

  async save(fleet: Fleet): Promise<void> {
    this.fleets.set(fleet.id, fleet);
  }

  async findById(id: string): Promise<Fleet | undefined> {
    return this.fleets.get(id);
  }
}
