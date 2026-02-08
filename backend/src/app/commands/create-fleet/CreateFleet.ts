import type { Fleet } from "../../../domain/fleet/Fleet.js";

export interface CreateFleet {
	userId: Fleet["userId"];
}
