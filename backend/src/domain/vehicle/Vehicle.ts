import type { Location, LocationData } from "../shared/Location.js";

export class Vehicle {
	private _location?: Location;

	constructor(
		public readonly plateNumber: string & { __brand: "PlateNumber" },
	) {}

	get location(): Location | undefined {
		return this._location;
	}

	set location(location: Location | undefined) {
		this._location = location;
	}

	isParkedAt(location: LocationData): boolean {
		return this._location?.equals(location) ?? false;
	}
}
