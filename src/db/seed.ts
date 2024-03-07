import { seed as freeResourcesSeeder } from "./seeders/freeResources.js";
import { seed as membershipSeeder } from "./seeders/membership.js";
import { seed as designKeyboardSeeder } from "./seeders/designKeyboard.js";
import { seed as effectsSeeder } from "./seeders/effects.js";
import { db } from "./db.js";

const main = async () => {
  try {
    await designKeyboardSeeder(db());
    await freeResourcesSeeder(db());
    await membershipSeeder(db());
  } catch (error) {
    console.error(error);
  } finally {
    db().$disconnect();
  }
};
main();
