import Database from "better-sqlite3";
import { SqliteFleetRepository } from "./SqliteFleetRepository.js";
import { SqliteVehicleRepository } from "./SqliteVehicleRepository.js";

export class DatabaseConnection {
  private db: Database.Database;
  public readonly fleetRepository: SqliteFleetRepository;
  public readonly vehicleRepository: SqliteVehicleRepository;

  constructor(dbPath: string = "fleet.db") {
    this.db = new Database(dbPath);
    this.fleetRepository = new SqliteFleetRepository(this.db);
    this.vehicleRepository = new SqliteVehicleRepository(this.db);
    this.init();
  }

  private init(): void {
    this.fleetRepository.init();
    this.vehicleRepository.init();
  }
}
