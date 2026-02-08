import type { Location } from "../shared/Location.js";

export class Vehicle {
  private _location?: Location;

  constructor(public readonly plateNumber: string) {}

  get location(): Location | undefined {
    return this._location;
  }

  park(location: Location): void {
    this._location = location;
  }

  isParkedAt(location: Location): boolean {
    return this._location?.equals(location) ?? false;
  }
}
