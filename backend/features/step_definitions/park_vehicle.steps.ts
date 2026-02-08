import { Given, When, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { FleetWorld } from "../support/world.js";
import { Location } from "../../src/domain/shared/Location.js";
import { VehicleAlreadyParkedAtLocationError } from "../../src/domain/fleet/errors.js";

Given("a location", function (this: FleetWorld) {
  this.location = new Location(48.8566, 2.3522);
});

Given("my vehicle has been parked into this location", async function (this: FleetWorld) {
  await this.parkVehicleHandler.handle({
    fleetId: this.myFleetId!,
    vehiclePlateNumber: this.vehiclePlateNumber!,
    latitude: this.location!.latitude,
    longitude: this.location!.longitude,
  });
});

When("I park my vehicle at this location", async function (this: FleetWorld) {
  await this.parkVehicleHandler.handle({
    fleetId: this.myFleetId!,
    vehiclePlateNumber: this.vehiclePlateNumber!,
    latitude: this.location!.latitude,
    longitude: this.location!.longitude,
  });
});

When("I try to park my vehicle at this location", async function (this: FleetWorld) {
  try {
    await this.parkVehicleHandler.handle({
      fleetId: this.myFleetId!,
      vehiclePlateNumber: this.vehiclePlateNumber!,
      latitude: this.location!.latitude,
      longitude: this.location!.longitude,
    });
  } catch (error) {
    this.error = error as Error;
  }
});

Then("the known location of my vehicle should verify this location", async function (this: FleetWorld) {
  const fleet = await this.fleetRepository.findById(this.myFleetId!);
  assert.ok(fleet);
  const vehicleLocation = fleet.getVehicleLocation(this.vehiclePlateNumber!);
  assert.ok(vehicleLocation?.equals(this.location!));
});

Then("I should be informed that my vehicle is already parked at this location", function (this: FleetWorld) {
  assert.ok(this.error instanceof VehicleAlreadyParkedAtLocationError);
});
