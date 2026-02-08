import type { Location } from "../../../domain/shared/Location.js";
import type { Vehicle } from "../../../domain/vehicle/Vehicle.js";

export interface ParkVehicle {
	vehiclePlateNumber: Vehicle["plateNumber"];
	location: Location;
}
