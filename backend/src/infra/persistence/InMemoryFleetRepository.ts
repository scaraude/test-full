import { Fleet } from "../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../domain/fleet/FleetRepository.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";

export class InMemoryFleetRepository implements FleetRepository {
	private fleets: Map<Fleet["id"], Fleet> = new Map();
	private fleetVehicles: Map<Fleet["id"], Set<Vehicle["plateNumber"]>> =
		new Map();

	async create(userId: Fleet["userId"]): Promise<Fleet["id"]> {
		const fleetId = Fleet.generateId();
		const fleet = new Fleet(fleetId, userId);
		this.fleets.set(fleetId, fleet);
		this.fleetVehicles.set(fleetId, new Set());
		return fleetId;
	}

	async addVehicles(
		fleetId: Fleet["id"],
		vehiclePlateNumbers: Vehicle["plateNumber"][],
	): Promise<void> {
		const vehicles = this.fleetVehicles.get(fleetId);
		if (!vehicles) {
			return;
		}
		for (const plateNumber of vehiclePlateNumbers) {
			vehicles.add(plateNumber);
		}
	}

	async findById(fleetId: Fleet["id"]): Promise<Fleet | undefined> {
		const fleet = this.fleets.get(fleetId);
		if (!fleet) {
			return undefined;
		}
		const vehiclePlateNumbers = this.fleetVehicles.get(fleetId) ?? new Set();
		return new Fleet(fleet.id, fleet.userId, [...vehiclePlateNumbers]);
	}
}
