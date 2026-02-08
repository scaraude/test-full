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

	async create(
		plateNumber: Vehicle["plateNumber"],
	): Promise<Vehicle["plateNumber"]> {
		this.db
			.prepare(
				`
      INSERT INTO vehicles (plate_number) VALUES (?)
    `,
			)
			.run(plateNumber);

		return plateNumber;
	}

	async updateLocation(
		vehicleId: Vehicle["plateNumber"],
		location: Location,
	): Promise<void> {
		this.db
			.prepare(
				`
      UPDATE vehicles
      SET latitude = ?, longitude = ?, altitude = ?
      WHERE plate_number = ?
    `,
			)
			.run(
				location.latitude,
				location.longitude,
				location.altitude ?? null,
				vehicleId,
			);
	}

	async findByPlateNumber(
		plateNumber: Vehicle["plateNumber"],
	): Promise<Vehicle | undefined> {
		const row = this.db
			.prepare(`SELECT * FROM vehicles WHERE plate_number = ?`)
			.get(plateNumber) as
			| {
					plate_number: Vehicle["plateNumber"];
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

	private rowToVehicle(row: {
		plate_number: Vehicle["plateNumber"];
		latitude: number | null;
		longitude: number | null;
		altitude: number | null;
	}): Vehicle {
		const vehicle = new Vehicle(row.plate_number);
		if (row.latitude !== null && row.longitude !== null) {
			const location = Location.fromData({
				latitude: row.latitude,
				longitude: row.longitude,
				altitude: row.altitude ?? undefined,
			});
			vehicle.location = location;
		}
		return vehicle;
	}
}
