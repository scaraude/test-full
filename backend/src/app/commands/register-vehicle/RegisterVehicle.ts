import type { Fleet } from "../../../domain/fleet/Fleet.js";
import type { Vehicle } from "../../../domain/vehicle/Vehicle.js";

export interface RegisterVehicle {
  fleetId: Fleet["id"];
  vehiclePlateNumber: Vehicle["plateNumber"];
}
