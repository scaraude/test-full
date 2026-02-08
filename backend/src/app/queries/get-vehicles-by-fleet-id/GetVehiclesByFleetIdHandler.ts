import { FleetNotFoundError } from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import type { Vehicle } from "../../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../../domain/vehicle/VehicleRepository.js";
import type { GetVehiclesByFleetId } from "./GetVehiclesByFleetId.js";

export class GetVehiclesByFleetIdHandler {
  constructor(
    private fleetRepository: FleetRepository,
    private vehicleRepository: VehicleRepository
  ) {}

  async handle(query: GetVehiclesByFleetId): Promise<Vehicle[]> {
    const fleet = await this.fleetRepository.findById(query.fleetId);
    if (!fleet) {
      throw new FleetNotFoundError(query.fleetId);
    }

    const plateNumbers = fleet.getVehiclePlateNumbers();
    return this.vehicleRepository.findByPlateNumbers(plateNumbers);
  }
}
