import Database from "better-sqlite3";
import { Fleet } from "../../domain/fleet/Fleet.js";
import type { FleetRepository } from "../../domain/fleet/FleetRepository.js";
import { Vehicle } from "../../domain/fleet/Vehicle.js";
import { Location } from "../../domain/shared/Location.js";

export class SqliteFleetRepository implements FleetRepository {
  private db: Database.Database;

  constructor(dbPath: string = "fleet.db") {
    this.db = new Database(dbPath);
    this.initSchema();
  }

  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS fleets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        plate_number TEXT NOT NULL,
        fleet_id TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        altitude REAL,
        PRIMARY KEY (plate_number, fleet_id),
        FOREIGN KEY (fleet_id) REFERENCES fleets(id)
      );
    `);
  }

  async save(fleet: Fleet): Promise<void> {
    const upsertFleet = this.db.prepare(`
      INSERT INTO fleets (id, user_id) VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET user_id = excluded.user_id
    `);

    const deleteVehicles = this.db.prepare(`DELETE FROM vehicles WHERE fleet_id = ?`);

    const insertVehicle = this.db.prepare(`
      INSERT INTO vehicles (plate_number, fleet_id, latitude, longitude, altitude)
      VALUES (?, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction(() => {
      upsertFleet.run(fleet.id, fleet.userId);
      deleteVehicles.run(fleet.id);

      for (const vehicle of fleet.getVehicles()) {
        const loc = vehicle.location;
        insertVehicle.run(
          vehicle.plateNumber,
          fleet.id,
          loc?.latitude ?? null,
          loc?.longitude ?? null,
          loc?.altitude ?? null
        );
      }
    });

    transaction();
  }

  async findById(id: string): Promise<Fleet | undefined> {
    const fleetRow = this.db.prepare(`SELECT * FROM fleets WHERE id = ?`).get(id) as
      | { id: string; user_id: string }
      | undefined;

    if (!fleetRow) {
      return undefined;
    }

    const fleet = new Fleet(fleetRow.id, fleetRow.user_id);

    const vehicleRows = this.db
      .prepare(`SELECT * FROM vehicles WHERE fleet_id = ?`)
      .all(id) as Array<{
      plate_number: string;
      fleet_id: string;
      latitude: number | null;
      longitude: number | null;
      altitude: number | null;
    }>;

    for (const row of vehicleRows) {
      const vehicle = new Vehicle(row.plate_number);
      if (row.latitude !== null && row.longitude !== null) {
        const location = new Location(
          row.latitude,
          row.longitude,
          row.altitude ?? undefined
        );
        vehicle.park(location);
      }
      fleet.registerVehicle(vehicle);
    }

    return fleet;
  }

  close(): void {
    this.db.close();
  }
}
