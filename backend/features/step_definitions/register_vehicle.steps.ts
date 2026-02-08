import { strict as assert } from "node:assert";
import { Given, Then, When } from "@cucumber/cucumber";
import { VehicleAlreadyRegisteredError } from "../../src/domain/fleet/errors.js";
import type { FleetWorld } from "../support/world.js";

Given("my fleet", async function (this: FleetWorld) {
  this.myFleetId = await this.createFleetHandler.handle({ userId: "user-1" });
});

Given("the fleet of another user", async function (this: FleetWorld) {
  this.otherFleetId = await this.createFleetHandler.handle({ userId: "user-2" });
});

Given("a vehicle", function (this: FleetWorld) {
  this.vehiclePlateNumber = "ABC-123";
});

Given("I have registered this vehicle into my fleet", async function (this: FleetWorld) {
  await this.registerVehicleHandler.handle({
    fleetId: this.myFleetId!,
    vehiclePlateNumber: this.vehiclePlateNumber!,
  });
});

Given("this vehicle has been registered into the other user's fleet", async function (this: FleetWorld) {
  await this.registerVehicleHandler.handle({
    fleetId: this.otherFleetId!,
    vehiclePlateNumber: this.vehiclePlateNumber!,
  });
});

When("I register this vehicle into my fleet", async function (this: FleetWorld) {
  await this.registerVehicleHandler.handle({
    fleetId: this.myFleetId!,
    vehiclePlateNumber: this.vehiclePlateNumber!,
  });
});

When("I try to register this vehicle into my fleet", async function (this: FleetWorld) {
  try {
    await this.registerVehicleHandler.handle({
      fleetId: this.myFleetId!,
      vehiclePlateNumber: this.vehiclePlateNumber!,
    });
  } catch (error) {
    this.error = error as Error;
  }
});

Then("this vehicle should be part of my vehicle fleet", async function (this: FleetWorld) {
  const fleet = await this.fleetRepository.findById(this.myFleetId!);
  assert.ok(fleet);
  assert.ok(fleet.hasVehicle(this.vehiclePlateNumber!));
});

Then("I should be informed this this vehicle has already been registered into my fleet", function (this: FleetWorld) {
  assert.ok(this.error instanceof VehicleAlreadyRegisteredError);
});
