export class Location {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly altitude?: number
  ) {}

  equals(other: Location): boolean {
    return (
      this.latitude === other.latitude &&
      this.longitude === other.longitude &&
      this.altitude === other.altitude
    );
  }
}
