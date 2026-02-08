import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { Location } from "../../src/domain/shared/Location.js";
import { VehicleAlreadyParkedAtLocationError } from "../../src/domain/vehicle/errors.js";
import { FleetWorld } from "../support/world.js";

Given("a location", function (this: FleetWorld) {
  this.location = new Location(48.8566, 2.3522);
});

Given(
  "my vehicle has been parked into this location",
  async function (this: FleetWorld) {
    await this.parkVehicleHandler.handle({
      vehiclePlateNumber: this.vehiclePlateNumber!,
      latitude: this.location!.latitude,
      longitude: this.location!.longitude,
    });
  }
);

When("I park my vehicle at this location", async function (this: FleetWorld) {
  await this.parkVehicleHandler.handle({
    vehiclePlateNumber: this.vehiclePlateNumber!,
    latitude: this.location!.latitude,
    longitude: this.location!.longitude,
  });
});

When(
  "I try to park my vehicle at this location",
  async function (this: FleetWorld) {
    try {
      await this.parkVehicleHandler.handle({
        vehiclePlateNumber: this.vehiclePlateNumber!,
        latitude: this.location!.latitude,
        longitude: this.location!.longitude,
      });
    } catch (error) {
      this.error = error as Error;
    }
  }
);

Then(
  "the known location of my vehicle should verify this location",
  async function (this: FleetWorld) {
    const vehicle = await this.vehicleRepository.findByPlateNumber(
      this.vehiclePlateNumber!
    );
    assert.ok(vehicle);
    assert.ok(vehicle.location?.equals(this.location!));
  }
);

Then(
  "I should be informed that my vehicle is already parked at this location",
  function (this: FleetWorld) {
    assert.ok(this.error instanceof VehicleAlreadyParkedAtLocationError);
  }
);
