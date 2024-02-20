import { seed as freeUserSeeder } from "./seeders/freeUser.js";
import { seed as membershipSeeder } from "./seeders/membership.js";
import { db } from "./db.js";

const main = async () => {
  try {
    await freeUserSeeder(db());
    await membershipSeeder(db());

  } catch (error) {
    console.error(error);
  } finally {
    db().$disconnect();
  }
};
main();
