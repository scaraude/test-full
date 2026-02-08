import type { Fleet } from "../../../domain/fleet/Fleet.js";
import type { Location } from "../../../domain/shared/Location.js";
import type { Vehicle } from "../../../domain/vehicle/Vehicle.js";

export interface ParkVehicle {
	fleetId: Fleet["id"];
	vehiclePlateNumber: Vehicle["plateNumber"];
	location: Location;
}
