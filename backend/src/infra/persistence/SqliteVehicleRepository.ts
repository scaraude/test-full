import type Database from "better-sqlite3";
import { Location } from "../../domain/shared/Location.js";
import { Vehicle } from "../../domain/vehicle/Vehicle.js";
import type { VehicleRepository } from "../../domain/vehicle/VehicleRepository.js";

export class SqliteVehicleRepository implements VehicleRepository {
  constructor(private db: Database.Database) {}

  init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vehicles (
        plate_number TEXT PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        altitude REAL
      );
    `);
  }

  async save(vehicle: Vehicle): Promise<void> {
    const loc = vehicle.location;
    this.db
      .prepare(
        `
      INSERT INTO vehicles (plate_number, latitude, longitude, altitude)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(plate_number) DO UPDATE SET
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        altitude = excluded.altitude
    `
      )
      .run(
        vehicle.plateNumber,
        loc?.latitude ?? null,
        loc?.longitude ?? null,
        loc?.altitude ?? null
      );
  }

  async findByPlateNumber(plateNumber: string): Promise<Vehicle | undefined> {
    const row = this.db
      .prepare(`SELECT * FROM vehicles WHERE plate_number = ?`)
      .get(plateNumber) as
      | {
          plate_number: string;
          latitude: number | null;
          longitude: number | null;
          altitude: number | null;
        }
      | undefined;

    if (!row) {
      return undefined;
    }

    return this.rowToVehicle(row);
  }

  async findByPlateNumbers(plateNumbers: string[]): Promise<Vehicle[]> {
    if (plateNumbers.length === 0) {
      return [];
    }

    const placeholders = plateNumbers.map(() => "?").join(", ");
    const rows = this.db
      .prepare(`SELECT * FROM vehicles WHERE plate_number IN (${placeholders})`)
      .all(...plateNumbers) as Array<{
      plate_number: string;
      latitude: number | null;
      longitude: number | null;
      altitude: number | null;
    }>;

    return rows.map((row) => this.rowToVehicle(row));
  }

  private rowToVehicle(row: {
    plate_number: string;
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
  }): Vehicle {
    const vehicle = new Vehicle(row.plate_number);
    if (row.latitude !== null && row.longitude !== null) {
      const location = new Location(
        row.latitude,
        row.longitude,
        row.altitude ?? undefined
      );
      vehicle.park(location);
    }
    return vehicle;
  }
}
