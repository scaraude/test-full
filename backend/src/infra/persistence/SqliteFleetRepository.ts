import type Database from "better-sqlite3";
import { Fleet } from "../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../domain/fleet/FleetRepository.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";

export class SqliteFleetRepository implements FleetRepository {
	constructor(private db: Database.Database) {}

	init(): void {
		this.db.exec(`
      CREATE TABLE IF NOT EXISTS fleets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS fleet_vehicles (
        fleet_id TEXT NOT NULL,
        plate_number TEXT NOT NULL,
        PRIMARY KEY (fleet_id, plate_number),
        FOREIGN KEY (fleet_id) REFERENCES fleets(id)
      );
    `);
	}

	async create(userId: Fleet["userId"]): Promise<Fleet["id"]> {
		const fleetId = Fleet.generateId();

		const createFleet = this.db.prepare(`
      INSERT INTO fleets (id, user_id) VALUES (?, ?)
    `);

		const transaction = this.db.transaction(() => {
			createFleet.run(fleetId, userId);
		});

		transaction();

		return fleetId;
	}

	async addVehicles(
		fleetId: Fleet["id"],
		vehiclePlateNumber: Vehicle["plateNumber"][],
	): Promise<void> {
		const addVehicle = this.db.prepare(`
      INSERT INTO fleet_vehicles (fleet_id, plate_number) VALUES (?, ?)
      ON CONFLICT(fleet_id, plate_number) DO NOTHING
    `);

		const transaction = this.db.transaction(() => {
			for (const plateNumber of vehiclePlateNumber) {
				addVehicle.run(fleetId, plateNumber);
			}
		});

		transaction();
	}

	async findById(fleetId: Fleet["id"]): Promise<Fleet | undefined> {
		const fleetRow = this.db
			.prepare(`SELECT * FROM fleets WHERE id = ?`)
			.get(fleetId) as
			| { id: Fleet["id"]; user_id: Fleet["userId"] }
			| undefined;

		if (!fleetRow) {
			return undefined;
		}

		const vehicleRows = this.db
			.prepare(`SELECT plate_number FROM fleet_vehicles WHERE fleet_id = ?`)
			.all(fleetId) as Array<{ plate_number: Vehicle["plateNumber"] }>;

		const plateNumbers = vehicleRows.map((row) => row.plate_number);

		return new Fleet(fleetRow.id, fleetRow.user_id, plateNumbers);
	}
}
