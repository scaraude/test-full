import { strict as assert } from "node:assert";
import { Given, Then, When } from "@cucumber/cucumber";
import { VehicleAlreadyRegisteredError } from "../../src/domain/fleet/errors.js";
import type { Fleet } from "../../src/domain/fleet/Fleet.js";
import { Location } from "../../src/domain/shared/Location.js";
import { VehicleAlreadyParkedAtLocationError } from "../../src/domain/vehicle/errors.js";
import type { Vehicle } from "../../src/domain/vehicle/Vehicle.js";
import type { FleetWorld } from "../support/world.js";

Given("my fleet", async function (this: FleetWorld) {
    this.myFleetId = await this.createFleetHandler.handle({ userId: "user-1" as Fleet["userId"] });
});

Given("a vehicle", function (this: FleetWorld) {
    this.vehiclePlateNumber = "ABC-123" as Vehicle["plateNumber"];
});

When("I register this vehicle into my fleet", async function (this: FleetWorld) {
    await this.registerVehicleHandler.handle({
        fleetId: this.myFleetId!,
        vehiclePlateNumber: this.vehiclePlateNumber!,
    });
});

Then("this vehicle should be part of my vehicle fleet", async function (this: FleetWorld) {
    const fleet = await this.fleetRepository.findById(this.myFleetId!);
    assert.ok(fleet);
    assert.ok(fleet.hasVehicle(this.vehiclePlateNumber!));
});

Given("I have registered this vehicle into my fleet", async function (this: FleetWorld) {
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

Then("I should be informed this this vehicle has already been registered into my fleet", function (this: FleetWorld) {
    assert.ok(this.error instanceof VehicleAlreadyRegisteredError);
});

Given("the fleet of another user", async function (this: FleetWorld) {
    this.otherFleetId = await this.createFleetHandler.handle({ userId: "user-2" as Fleet["userId"] });
});

Given("this vehicle has been registered into the other user's fleet", async function (this: FleetWorld) {
    await this.registerVehicleHandler.handle({
        fleetId: this.otherFleetId!,
        vehiclePlateNumber: this.vehiclePlateNumber!,
    });
});

Given("a location", function (this: FleetWorld) {
    this.location = Location.fromData({ latitude: 48.8566, longitude: 2.3522 });
});

Given(
    "my vehicle has been parked into this location",
    async function (this: FleetWorld) {
        await this.parkVehicleHandler.handle({
            vehiclePlateNumber: this.vehiclePlateNumber!,
            location: this.location!
        });
    }
);

When("I park my vehicle at this location", async function (this: FleetWorld) {
    await this.parkVehicleHandler.handle({
        vehiclePlateNumber: this.vehiclePlateNumber!,
        location: this.location!
    });
});

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

When(
    "I try to park my vehicle at this location",
    async function (this: FleetWorld) {
        try {
            await this.parkVehicleHandler.handle({
                vehiclePlateNumber: this.vehiclePlateNumber!,
                location: this.location!
            });
        } catch (error) {
            this.error = error as Error;
        }
    }
);

Then(
    "I should be informed that my vehicle is already parked at this location",
    function (this: FleetWorld) {
        assert.ok(this.error instanceof VehicleAlreadyParkedAtLocationError);
    }
);
