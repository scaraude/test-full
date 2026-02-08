import type Database from "better-sqlite3";
import { Fleet } from "../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../domain/fleet/FleetRepository.js";

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

  async save(fleet: Fleet): Promise<void> {
    const upsertFleet = this.db.prepare(`
      INSERT INTO fleets (id, user_id) VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET user_id = excluded.user_id
    `);

    const deleteFleetVehicles = this.db.prepare(
      `DELETE FROM fleet_vehicles WHERE fleet_id = ?`
    );

    const insertFleetVehicle = this.db.prepare(`
      INSERT INTO fleet_vehicles (fleet_id, plate_number) VALUES (?, ?)
    `);

    const transaction = this.db.transaction(() => {
      upsertFleet.run(fleet.id, fleet.userId);
      deleteFleetVehicles.run(fleet.id);

      for (const plateNumber of fleet.getVehiclePlateNumbers()) {
        insertFleetVehicle.run(fleet.id, plateNumber);
      }
    });

    transaction();
  }

  async findById(id: string): Promise<Fleet | undefined> {
    const fleetRow = this.db
      .prepare(`SELECT * FROM fleets WHERE id = ?`)
      .get(id) as { id: string; user_id: string } | undefined;

    if (!fleetRow) {
      return undefined;
    }

    const vehicleRows = this.db
      .prepare(`SELECT plate_number FROM fleet_vehicles WHERE fleet_id = ?`)
      .all(id) as Array<{ plate_number: string }>;

    const plateNumbers = vehicleRows.map((row) => row.plate_number);

    return new Fleet(fleetRow.id, fleetRow.user_id, plateNumbers);
  }
}
