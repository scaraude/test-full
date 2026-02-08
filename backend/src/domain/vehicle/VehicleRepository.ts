import type { Location } from "../shared/Location.js";
import type { Vehicle } from "./Vehicle.js";

export interface VehicleRepository {
  create(plateNumber: Vehicle["plateNumber"]): Promise<Vehicle["plateNumber"]>;
  updateLocation(vehicleId: Vehicle["plateNumber"], location: Location): Promise<void>;
  findByPlateNumber(plateNumber: Vehicle["plateNumber"]): Promise<Vehicle | undefined>;
}
