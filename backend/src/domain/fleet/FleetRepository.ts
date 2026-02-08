import type { Vehicle } from "../vehicle/Vehicle.js";
import type { Fleet } from "./Fleet.js";

export interface FleetRepository {
  create(userId: Fleet["userId"]): Promise<Fleet["id"]>;
  addVehicles(fleetId: Fleet["id"], vehiclePlateNumber: Vehicle["plateNumber"][]): Promise<void>;
  findById(fleetId: Fleet["id"]): Promise<Fleet | undefined>;
}
