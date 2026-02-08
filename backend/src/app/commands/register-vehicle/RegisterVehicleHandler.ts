import {
	FleetNotFoundError,
	VehicleAlreadyRegisteredError,
} from "../../../domain/fleet/errors.js";
import type { FleetRepository } from "../../../domain/fleet/FleetRepository.js";
import type { VehicleRepository } from "../../../domain/vehicle/VehicleRepository.js";
import type { RegisterVehicle } from "./RegisterVehicle.js";

export class RegisterVehicleHandler {
	constructor(
		private fleetRepository: FleetRepository,
		private vehicleRepository: VehicleRepository,
	) {}

	async handle(command: RegisterVehicle): Promise<void> {
		const { fleetId, vehiclePlateNumber } = command;

		const fleet = await this.fleetRepository.findById(fleetId);
		if (!fleet) {
			throw new FleetNotFoundError(fleetId);
		}

		const existingVehicle =
			await this.vehicleRepository.findByPlateNumber(vehiclePlateNumber);
		if (!existingVehicle) {
			await this.vehicleRepository.create(vehiclePlateNumber);
		}

		if (fleet.hasVehicle(vehiclePlateNumber)) {
			throw new VehicleAlreadyRegisteredError(vehiclePlateNumber, fleet.id);
		}
		await this.fleetRepository.addVehicles(fleet.id, [vehiclePlateNumber]);
	}
}
