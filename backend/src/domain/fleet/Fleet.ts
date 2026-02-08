import { v4 as uuidv4 } from "uuid";
import type { Vehicle } from "../vehicle/Vehicle.js";

export class Fleet {
	private vehiclePlateNumbers: Set<Vehicle["plateNumber"]> = new Set();

	constructor(
		public readonly id: string & { __brand: "FleetId" },
		public readonly userId: string & { __brand: "UserId" },
		vehiclePlateNumbers: Vehicle["plateNumber"][] = [],
	) {
		this.vehiclePlateNumbers = new Set(vehiclePlateNumbers);
	}

	static generateId(): Fleet["id"] {
		return uuidv4() as Fleet["id"];
	}

	hasVehicle(plateNumber: Vehicle["plateNumber"]): boolean {
		return this.vehiclePlateNumbers.has(plateNumber);
	}

	getVehiclePlateNumbers(): Vehicle["plateNumber"][] {
		return [...this.vehiclePlateNumbers];
	}
}
