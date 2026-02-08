import {
	FleetNotFoundError,
	VehicleNotRegisteredInFleetError,
} from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import {
	VehicleAlreadyParkedAtLocationError,
	VehicleNotFoundError,
} from "../../../domain/vehicle/errors.js";
import type { VehicleRepository } from "../../../domain/vehicle/VehicleRepository.js";
import type { ParkVehicle } from "./ParkVehicle.js";

export class ParkVehicleHandler {
	constructor(
		private fleetRepository: FleetRepository,
		private vehicleRepository: VehicleRepository,
	) {}

	async handle(command: ParkVehicle): Promise<void> {
		const { fleetId, vehiclePlateNumber, location } = command;

		const fleet = await this.fleetRepository.findById(fleetId);
		if (!fleet) {
			throw new FleetNotFoundError(fleetId);
		}

		if (!fleet.hasVehicle(vehiclePlateNumber)) {
			throw new VehicleNotRegisteredInFleetError(vehiclePlateNumber, fleetId);
		}

		const vehicle =
			await this.vehicleRepository.findByPlateNumber(vehiclePlateNumber);
		if (!vehicle) {
			throw new VehicleNotFoundError(vehiclePlateNumber);
		}

		if (vehicle.isParkedAt(location)) {
			throw new VehicleAlreadyParkedAtLocationError(vehiclePlateNumber);
		}

		await this.vehicleRepository.updateLocation(vehicle.plateNumber, location);
	}
}
