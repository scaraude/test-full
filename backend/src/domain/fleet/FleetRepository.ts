import type { Fleet } from "./Fleet.js";

export interface FleetRepository {
  save(fleet: Fleet): Promise<void>;
  findById(id: string): Promise<Fleet | undefined>;
}
