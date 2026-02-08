#!/usr/bin/env node
import { program } from "commander";
import { CreateFleetHandler } from "../../app/commands/create-fleet/CreateFleetHandler.js";
import { ParkVehicleHandler } from "../../app/commands/park-vehicle/ParkVehicleHandler.js";
import { RegisterVehicleHandler } from "../../app/commands/register-vehicle/RegisterVehicleHandler.js";
import type { Fleet } from "../../domain/fleet/Fleet.js";
import { Location } from "../../domain/shared/Location.js";
import type { Vehicle } from "../../domain/vehicle/Vehicle.js";
import { DatabaseConnection } from "../persistence/DatabaseConnection.js";

const DB_PATH = process.env.FLEET_DB_PATH || "fleet.db";
const db = new DatabaseConnection(DB_PATH);

program
	.name("fleet")
	.description("Vehicle fleet management CLI")
	.version("1.0.0");

program
	.command("create")
	.description("Create a new fleet for a user")
	.argument("<userId>", "User ID")
	.action(async (userId: Fleet["userId"]) => {
		const handler = new CreateFleetHandler(db.fleetRepository);
		const fleetId = await handler.handle({ userId });
		console.log(fleetId);
	});

program
	.command("register-vehicle")
	.description("Register a vehicle to a fleet")
	.argument("<fleetId>", "Fleet ID")
	.argument("<vehiclePlateNumber>", "Vehicle plate number")
	.action(
		async (
			fleetId: Fleet["id"],
			vehiclePlateNumber: Vehicle["plateNumber"],
		) => {
			const handler = new RegisterVehicleHandler(
				db.fleetRepository,
				db.vehicleRepository,
			);
			await handler.handle({ fleetId, vehiclePlateNumber });
		},
	);

program
	.command("localize-vehicle")
	.description("Set the location of a vehicle")
	.argument("<fleetId>", "Fleet ID")
	.argument("<vehiclePlateNumber>", "Vehicle plate number")
	.argument("<lat>", "Latitude")
	.argument("<lng>", "Longitude")
	.argument("[alt]", "Altitude (optional)")
	.action(
		async (
			fleetId: Fleet["id"],
			vehiclePlateNumber: Vehicle["plateNumber"],
			lat: string,
			lng: string,
			alt?: string,
		) => {
			const handler = new ParkVehicleHandler(db.fleetRepository, db.vehicleRepository);
			await handler.handle({
				fleetId,
				vehiclePlateNumber,
				location: Location.fromData({
					latitude: parseFloat(lat),
					longitude: parseFloat(lng),
					altitude: alt ? parseFloat(alt) : undefined,
				}),
			});
		},
	);

program.parseAsync(process.argv).catch((error) => {
	console.error(error.message);
	process.exit(1);
});
