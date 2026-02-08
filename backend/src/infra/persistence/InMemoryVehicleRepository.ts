import type { Location } from "../../domain/shared/Location.js";
import { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../domain/vehicle/VehicleRepository.js";

export class InMemoryVehicleRepository implements VehicleRepository {
	private vehicles: Map<Vehicle["plateNumber"], Vehicle> = new Map();

	async create(
		plateNumber: Vehicle["plateNumber"],
	): Promise<Vehicle["plateNumber"]> {
		const vehicle = new Vehicle(plateNumber);
		this.vehicles.set(plateNumber, vehicle);
		return plateNumber;
	}

	async updateLocation(
		vehicleId: Vehicle["plateNumber"],
		location: Location,
	): Promise<void> {
		const vehicle = this.vehicles.get(vehicleId);
		if (vehicle) {
			vehicle.location = location;
		}
	}

	async findByPlateNumber(
		plateNumber: Vehicle["plateNumber"],
	): Promise<Vehicle | undefined> {
		return this.vehicles.get(plateNumber);
	}
}
