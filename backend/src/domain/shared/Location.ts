export interface LocationData {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export class Location {
  private constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly altitude?: number
  ) { }

  static fromData(data: LocationData): Location {
    return new Location(data.latitude, data.longitude, data.altitude);
  }

  equals(other: LocationData): boolean {
    return (
      this.latitude === other.latitude &&
      this.longitude === other.longitude &&
      this.altitude === other.altitude
    );
  }
}
